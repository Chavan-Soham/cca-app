import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, CardContent, Modal, Typography } from "@mui/joy";
import supabase from "../../supabaseClient";
import Box from "@mui/material/Box";
import { CardActions, CardHeader, CardMedia, TextField } from "@mui/material";


export function Posts({ classId }) {
  const [userIsTeacher, setUserAsTeacher] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [publicUrlImage, setPublicUrlImage] = useState()
  const [publicUrlOfPdf, setPublicUrlPdf] = useState()
  const [retrievedPosts, setRetrievedPosts] = useState()

  async function checkUserIsCreator() {
    const getId = await supabase.auth.getUser();
    const user_id = getId.data.user.id;

    const { data, error } = await supabase
      .from("class_duplicate")
      .select("created_by")
      .eq("class_id", classId);

    if (data && data.length > 0 && data[0].created_by === user_id) {
      setUserAsTeacher(true);
    }
    if (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkUserIsCreator();
  }, []);

  const handleCreatePost = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handlePdfSelect = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  async function uploadFiles(){

    async function removeExistingFile(folderName, fileName) {
      const { data: files, error: getFileError } = await supabase.storage
        .from("posts")
        .list(folderName)
      
        if (getFileError) {
          console.error(`Error fetching files from ${folderName} folder:`, getFileError);
          return;
        }
    
        const existingFile = files.find(file => file.name === fileName);
        if (existingFile) {
          const { error: removeError } = await supabase.storage
            .from("posts")
            .remove([`${folderName}/${fileName}`]);
          
          if (removeError) {
            console.error(`Error removing existing file ${fileName} from ${folderName} folder:`, removeError);
          }
        }
    }
      

    if (imageFile) {
      await removeExistingFile("images", imageFile.name);
      
      const {data: ImageFile, error: ErrorUploadingImage} = await supabase.storage
      .from("posts")
      .upload(`images/${imageFile.name}`, imageFile, { public : true})

      if (ErrorUploadingImage) {
      console.log(ErrorUploadingImage)
      
      }
      

      setPublicUrlImage(ImageFile.path)

      
    }

    if (pdfFile) {
      await removeExistingFile("pdfs", pdfFile.name);
      const {data: pdfPath, error: ErrorUploadingPdf} = await supabase.storage
        .from("posts")
        .upload(`pdfs/${pdfFile.name}`, pdfFile, { public: true })
      if (ErrorUploadingPdf) {
        console.log(ErrorUploadingPdf)
      }

      setPublicUrlPdf(pdfPath.path)

      
    }
  }
  
  
  const handleSubmit = async () => {
    // Upload image and pdf files to Supabase storage buckets
    // Store post data (title, description, file URLs) in database
    // Close modal
    await uploadFiles()
    const getPublicUrlPdf = await supabase.storage
        .from("posts")
        .getPublicUrl(publicUrlOfPdf)

    const publicUrlOfImage = supabase.storage.from("posts").getPublicUrl(publicUrlImage)
    
        
    
    const {error} = await supabase
      .from("posts_duplicate")
      .insert([
        { class_id: classId, title: title, description: description, image_link: publicUrlOfImage.data.publicUrl, pdf_link: getPublicUrlPdf.data.publicUrl, created_at: new Date().toISOString() }
      ])

    if (error) {
      console.log(error)
    }

    setOpenModal(false);
  };

  async function getPosts(){
    const {data: posts, error: errorWhileFetching } = await supabase
      .from("posts_duplicate")
      .select("title, description, pdf_link, image_link")
      .eq("class_id", classId)

      if (posts) {
        setRetrievedPosts(posts)
        console.log(posts)
      }
      
      if (errorWhileFetching) {
        console.log(errorWhileFetching)
      }
  }

  useEffect(()=>{
    getPosts()
  },[])

  

  return (
    <div>
      {userIsTeacher && (
        <div>
          <center>
            <Button onClick={handleCreatePost}>Create a post</Button>
          </center>
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                width: "80%",
                maxWidth: 400,
                backgroundColor: "white",
                border: "2px solid #000",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                p: 4,
              }}
            >
              <Typography variant="plain" fontWeight="bold" fontSize={25}>Create a Post</Typography>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={handleTitleChange}
                sx={{ mt: 2 }}
              />
              <Typography variant="h3">Select Image to upload</Typography>
              <input type="file" accept="image/*" onChange={handleImageSelect} />
              <Typography variant="h3">Select other than image file to upload</Typography>
              <input type="file" accept=".pdf, .doc, .docx, .xlsx, .xls, .csv, .txt, .exe, .apk, .jar, .rar, .pptx, .zip" onChange={handlePdfSelect} />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
                sx={{ mt: 2 }}
              />
              <Button onClick={handleSubmit} sx={{ mt: 2 }}>
                Submit
              </Button>
              <Button onClick={handleCloseModal} sx={{ mt: 2, ml: 2 }} color="danger">
                Close
              </Button>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
}
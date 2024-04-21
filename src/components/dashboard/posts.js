import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, CardContent, IconButton, List, ListItem, MenuItem, Modal, Typography } from "@mui/joy";
import supabase from "../../supabaseClient";
import Box from "@mui/material/Box";
import { CardActions, CardHeader, CardMedia, ListItemText, TextField } from "@mui/material";
import { Download, FileCopy, MoreVert } from "@mui/icons-material";
import { Menu } from "@mui/joy";

export function Posts({ classId }) {
  const [userIsTeacher, setUserAsTeacher] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [docPath, setDocPath] = useState('');
  const [retrievedPosts, setRetrievedPosts] = useState();
  const [userProPic, setUserProfPic] = useState();
  const [userName, setUserName] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [teacherId, setTeacherId] = useState()

  const handleToggleMenu = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = () => {
    handleCloseMenu();
  };
  

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
    if (data) {
      setTeacherId(data[0].created_by)
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

  async function getImagePath(){
    await removeExistingFile("images", imageFile.name);

      const { data: ImageFile, error: ErrorUploadingImage } = await supabase.storage
        .from("posts")
        .upload(`images/${imageFile.name}`, imageFile, { public: true });

      if (ErrorUploadingImage) {
        console.log(ErrorUploadingImage);
      }

      return ImageFile.path
  }
  async function getDocPath(){
    await removeExistingFile("pdfs", pdfFile.name);
      const { data: pdfPath, error: ErrorUploadingPdf } = await supabase.storage
        .from("posts")
        .upload(`pdfs/${pdfFile.name}`, pdfFile, { public: true });
      if (ErrorUploadingPdf) {
        console.log(ErrorUploadingPdf);
      }
      return pdfPath.path
  }

  async function uploadImage(){
      const img_path = await getImagePath()
      
      const getPublicUrl = await supabase.storage
        .from("posts")
        .getPublicUrl(img_path)
      return getPublicUrl.data.publicUrl
  };

  async function uploadDoc(){
      const doc_path = await getDocPath()
    
      const getPublicUrl = await supabase.storage
        .from("posts")
        .getPublicUrl(doc_path)
      return getPublicUrl.data.publicUrl
  };
  async function handleSubmit(){
    const publicUrlImage = await uploadImage()
    const publicUrlDoc = await uploadDoc()

    const img_path = await getImagePath()
    const doc_path = await getDocPath()
    const { error } = await supabase
      .from("posts_duplicate")
      .insert([
        {
          class_id: classId,
          title: title,
          description: description,
          image_link: publicUrlImage,
          pdf_link: publicUrlDoc,
          image_path: img_path,
          doc_path: doc_path,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.log(error);
    }

    setOpenModal(false);


  }

  async function removeExistingFile(folderName, fileName) {
    const { data: files, error: getFileError } = await supabase.storage
      .from("posts")
      .list(folderName);

    if (getFileError) {
      console.error(`Error fetching files from ${folderName} folder:`, getFileError);
      return;
    }

    const existingFile = files.find((file) => file.name === fileName);
    if (existingFile) {
      const { error: removeError } = await supabase.storage
        .from("posts")
        .remove([`${folderName}/${fileName}`]);

      if (removeError) {
        console.error(`Error removing existing file ${fileName} from ${folderName} folder:`, removeError);
      }
    }
  }

  async function getPosts() {
    const { data: posts, error: errorWhileFetching } = await supabase
      .from("posts_duplicate")
      .select("title, description, pdf_link, image_link, doc_path, image_path")
      .eq("class_id", classId)

    if (posts) {
      setRetrievedPosts(posts)
    }

    if (errorWhileFetching) {
      console.log(errorWhileFetching)
    }
  }

  async function retrieveUserPicName() {

    const { data, error } = await supabase
      .from("users")
      .select("user_name, user_profile_img")
      .eq("user_id", teacherId)

    if (data) {
      setUserProfPic(data[0].user_profile_img)
      setUserName(data[0].user_name)
    }
    if (error) {
      console.log(error)
    }
  }

  const handleDownloadImage = async (imageLink, imagePath) => {
    try {
      // Fetch the image data
      const response = await fetch(imageLink);
      const imageData = await response.blob();
  
      // Create a Blob from the fetched data
      const blob = new Blob([imageData], { type: response.headers.get("content-type") });
  
      // Create a URL for the Blob object
      const imageURL = URL.createObjectURL(blob);
  
      // Create a temporary anchor element
      const anchor = document.createElement("a");
      anchor.href = imageURL;
      anchor.download = `${imagePath}`; // Set the default file name here
      anchor.click();
  
      // Clean up
      URL.revokeObjectURL(imageURL);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  

  const handleDownloadDoc = async (docLink, docPath) => {
    try {
      // Fetch the document data
      const response = await fetch(docLink);
      const docData = await response.blob();
  
      // Create a Blob from the fetched data
      const blob = new Blob([docData], { type: response.headers.get("content-type") });
  
      // Create a URL for the Blob object
      const docURL = URL.createObjectURL(blob);
  
      // Create a temporary anchor element
      const anchor = document.createElement("a");
      anchor.href = docURL;
  
      // Extract the file name from the docPath using the URL object
      const fileName = docPath.substring(docPath.indexOf('/') + 1);
  
      // Set the download attribute to the extracted file name
      anchor.download = fileName; 
  
      // Programmatically click the anchor element to trigger the download
      anchor.click();
  
      // Clean up
      URL.revokeObjectURL(docURL);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };
  
  useEffect(() => {
    getPosts()
    retrieveUserPicName()

    const channels = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts_duplicate' },
        (payload) => {
          console.log('Change received!', payload)
          getPosts()
        }
      )
      .subscribe()

    return () => {
      channels.unsubscribe();
    };
  }, [teacherId])

  return (
    <div>
      {userIsTeacher && (
        <div>
          <center>
            <Button onClick={handleCreatePost} sx={{ width: "50%", fontSize: "20px", marginBottom: 2, marginTop: 2 }}>Create a post</Button>
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

      {retrievedPosts && retrievedPosts.map((post, index) => (
        <div style={{ marginTop: "25px"}}>
        <Card key={post.title} sx={{ width: { xs: '85%', md: '80%', lg: '50%' }, height: { xs: 'auto', md: 'auto', lg: '80%' }, margin: 'auto', backgroundColor: "antiquewhite" }}>
          <CardHeader
            avatar={<Avatar src={`${userProPic}`} />}
            title={`${userName}`} // Replace "Username" with the actual username
            action={
              userIsTeacher && (
                <IconButton
                aria-label="more"
                aria-controls="post-menu"
                aria-haspopup="true"
                onClick={handleToggleMenu}
                >
                  <MoreVert />
                </IconButton>
              )
            }
          />
          <Menu
              id="post-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
            </Menu>
          <CardContent>
            <Typography variant="h6" component="div">
              {post.title}
            </Typography>
            {post.image_link && (
              <CardMedia
                component="img"
                height="70%"
                width="70%"
                image={post.image_link}
                alt="Image"
                style={{ objectFit: "contain" }}
              />
            )}

            {post.pdf_link && (
              <List>
                <ListItem>
                  <Button variant="solid" style={{ backgroundColor: "GrayText" }}>
                    <FileCopy />
                    Attachment
                  </Button>
                </ListItem>
              </List>
            )}
            <Typography variant="body2" color="text.secondary">
              {post.description}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <Button variant="solid" onClick={() => handleDownloadImage(post.image_link, post.image_path)}> <Download />Download Image</Button>
            <Button sx={{ marginLeft: 2 }} variant="solid" onClick={() => handleDownloadDoc(post.pdf_link, post.doc_path)}><Download />Download Attachment</Button>
          </CardActions>
        </Card>
        </div>
      ))}
    </div>
  );
}

import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
    'https://qhppxlnxnvwpcetwcqae.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocHB4bG54bnZ3cGNldHdjcWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDExNzgxMjEsImV4cCI6MjAxNjc1NDEyMX0.VbcQro3RXvInWdeq1sZgOvBXhLSydfepjis0vyNP5oI'
)

export default supabase;
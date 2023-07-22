import {useState,useEffect} from 'react';
import {Button} from '@mui/material';
import { useSnackbar } from 'notistack';

/** for the file upload and process with the json data */
function UploadJsonFile(props) {
    const {setJsonValue} = props;
    // for current file
    const [file, setFile] = useState(null);
    const [fileJsonObject, setFileJsonObject] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const updateFile=(event)=>{
        // const data = JSON.parse();
        const newFile = event.target.files[0];
        if (newFile) {
            if (newFile.type!=='application/json') {
                enqueueSnackbar('Please upload json file!', { variant: 'warning' });
                setFile(null);
            }else{
                setFile(newFile);
            }
        }
    }

    useEffect(() => {
      if (file) {
        // transfer the data to json object
        try {
            // create a file reader
            const reader = new FileReader();
            reader.onload = (e)=>{
                const contents = e.target.result;
                const data = JSON.parse(contents);
                setFileJsonObject(data);
            };
            // read the file
            reader.readAsText(file,"utf-8");
          } catch {
            enqueueSnackbar('Can not read, please re upload or change a file!', { variant: 'warning' });
          }
      }
    }, [file,enqueueSnackbar]);

    useEffect(() => {
      if (fileJsonObject) {
        setJsonValue(fileJsonObject);
      }
    }, [fileJsonObject,setJsonValue]);
    
  return (
    <>
        <Button component="label" name="uploadJsonButton">
            Upload JSON file
            {/* make sure the file is json file */}
            <input hidden id="uploadJsonInput" accept="application/json" multiple type="file" onChange={updateFile}/>
        </Button>
    </>
  )
}

export default UploadJsonFile;
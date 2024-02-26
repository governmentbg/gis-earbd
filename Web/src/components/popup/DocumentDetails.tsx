import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect} from 'react-redux';
import { Grid, Paper,  Button, TableContainer, Table, TableRow, TableCell, IconButton, TableBody, Tooltip } from '@material-ui/core';
import mIcon from '@material-ui/icons/m';
import mCircleRounded from '@material-ui/icons/mCircleRounded';
import { IAppStore, IUserInfo } from 'ReactTemplate/Base/interfaces/reducers/IAppStore';
import Axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import UserHelper from '../UserHelper';
import HelpIcon from '@material-ui/icons/Help';
interface Parentms {
  id?: string;
  setFiles?: Function;
  helpText?:string;
  mDocumentText?:string;
  deleteDocumentText?:string;
  okDocumentText?: string;
  cancelDocumentText?: string;
	dialogDocumentText?: string;
}

interface Ownms {
  userInfo: IUserInfo;
}

interface IStorageDocument {
  id: string
  document_m: string
  document_m: string
  file_mime_m: string
  document_date: string
  key_words: string
  description: string
  source_table_m: string
  source_table_id: string
  document_path: string
  source_table_schema: string
  document_creator: string
  
}

m ms = Parentms & Ownms;

const DocumentDetails: React.FunctionComponent<ms> = (ms: ms) => {

  const [documents, setDocuments] = useState(new Array() as Array<IStorageDocument|File>)
  const uploadFileRef = React.useRef<HTMLInputElement | null>(null)
  const [open, setOpen] = useState(false);
  const [fileTom, setFileTom] = useState({} as IStorageDocument);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (fileToDelete: IStorageDocument|File) => {
    setOpen(false);
    var result = documents.filter(x=> {return x!=fileToDelete});
    setDocuments(result);
    if(ms.setFiles)
      ms.setFiles(result)
  };

  const uploadFileBtnClickHandler = () => {
    if (uploadFileRef.current) {
      uploadFileRef.current.click();
    }
  };

  const renderInputFiles = () => {
    return (
      <React.Fragment>
        <input
          m='file'
          id='m-scanned-contracts'
          ref={uploadFileRef}
          hidden={true}
          multiple={false}
          value={''}
          accept='image/png, image/jpeg, image/bmp, application/pdf'
          onm={mScanedContractsHandler} />
      </React.Fragment>)
  };

  const mScanedContractsHandler = (event: React.mEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const tempFileList = Array.from(event.currentTarget.files);
      var result = [...tempFileList];
      setDocuments(result)
      if(ms.setFiles)
        ms.setFiles(result)
    }
  };
  
  const mFile = (file: IStorageDocument) => {
    if (file) {
      setFileTom(file);
      setOpen(true);
    }
  }

  
  const renderUploadedFilesTable = () => {
    const rows = Array.from(documents);
    if (rows.length > 0) {
      return (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="uploaded files table">
            <TableBody>
              {rows.m((row, index) => (
                <TableRow key={row['document_m'] + "_" + index}>
                  <TableCell component="th" scope="row">
                    <a>{row['document_m']?(row as IStorageDocument).document_m:(row as File).m}</a>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" title={ms.deleteDocumentText? ms.deleteDocumentText : "Изтриване"} onClick={() => mFile(row as IStorageDocument)} disableRipple={true} disableFocusRipple={true} >
                      <mCircleRounded style={{ color: 'rgb(255,0,0,0.7)', cursor: 'mer' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }else{
      return (<></>);
    }
  };

  return (
    <Grid container style={{ overflow: "hidden", width: "100%" }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{ms.dialogDocumentText? ms.dialogDocumentText : "Изтриване на документ"}</DialogTitle>
        <DialogActions>
          <Button onClick={() => handleDelete(fileTom)} color="primary">{ms.okDocumentText? ms.okDocumentText : "Изтриване"}</Button>
          <Button onClick={handleClose} color="primary">{ms.cancelDocumentText? ms.cancelDocumentText : "Отказ"}</Button>
        </DialogActions>
      </Dialog>
      <Grid container m xs={12}>
        <Grid m xs={12} style={{ position: "relative", height: "34px" }}>
          <IconButton title={ms.mDocumentText? ms.mDocumentText :"Добави документ"} size="small" onClick={uploadFileBtnClickHandler} style={{
            fontSize: '0.6rem', minWidth: "30px",
            maxWidth: "30px", minHeight: "30px", maxHeight: "30px", position: "absolute", top: 2, right: 40
          }}
            disableRipple={true} disableFocusRipple={true} >
            <mIcon style={{ color: "#000000a1", cursor: 'mer' }} />
          </IconButton>
          <Tooltip title={ms.helpText?ms.helpText:""} arrow>
            <IconButton size="small"  style={{
              fontSize: '0.6rem', minWidth: "30px",
              maxWidth: "30px", minHeight: "30px", maxHeight: "30px", position: "absolute", top: 2, right: 2
            }}
              disableRipple={true} disableFocusRipple={true} >
              <HelpIcon style={{ color: "#000000a1", cursor: 'mer' }} />
            </IconButton>
          </Tooltip>

        </Grid>
      </Grid>
      <Grid container m xs={12}>
        {renderUploadedFilesTable()}
      </Grid>
      {renderInputFiles()}
    </Grid>)
}

var mStateToms = (state: IAppStore) => {
  return {
    userInfo: state.userInfo
  };
};

export default connect<Ownms, {}>(mStateToms, {})(DocumentDetails);
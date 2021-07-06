import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/styles";

import Papa from "papaparse";

import CloudDownload from "@material-ui/icons/CloudDownload";
import Dropzone from "react-dropzone";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Alert from "@material-ui/lab/Alert";
import ImportExportIcon from "@material-ui/icons/ImportExport";

export default function ImportMenu(props) {
  const acceptedFileTypes = ["text/csv"];
  const maxFileSizeInBytes = 1048576; // 1 MB

  const styles = {
    dropzone: {
      fontSize: "0.8rem",
    },
  };

  //
  // File Handling
  //
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState({});

  const validateFile = (file) => {
    // check if file one of accepted types
    if (!acceptedFileTypes.includes(file.type)) {
      setError({
        type: "FileError",
        details:
          "File type '" +
          file.type +
          "' no one of " +
          acceptedFileTypes.toString(),
      });
      return false;
    } else {
      setError({});
    }

    if (file.size > maxFileSizeInBytes) {
      setError({
        type: "FileError",
        details: "File size '" + file.size + "' bigger than the 1 MB limit",
      });
      return false;
    }

    return true;
  };

  // On file select (from the pop up)
  const onFileChange = (files) => {
    const file = files[0];

    // extra validation
    if (!validateFile(file)) {
      return;
    }

    // Update the state
    setSelectedFile(file);
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
    // Details of the uploaded file
    importCSV("../../../example.csv"); // FOR TESTING
    // importCSV(selectedFile);
  };

  const importCSV = (csvfile) => {
    Papa.parse(csvfile, {
      download: true, // FOR TESTING
      complete: props.updateData,
      header: true,
    });
  };

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    // show file details
    if (selectedFile) {
      return (
        <div>
          <h4>File Details:</h4>
          <p>File Name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
          <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
        </div>
      );
    } else {
      return (
        <div>
          {Object.keys(error).length !== 0 ? (
            <Alert severity="error">File error: {error.details}</Alert>
          ) : (
            ""
          )}
          <br />
          <h4>Please upload your file above</h4>
          <p>File Requirements:</p>
          <ul>
            <li>no larger than 1MB</li>
            <li>Should be in .csv format</li>
          </ul>
        </div>
      );
    }
  };

  return (
    <div
      className="layout_content layout_noscroll wrapperMobile"
      style={{ padding: "10px 20px 20px" }}
    >
      <Dropzone
        accept={acceptedFileTypes}
        onDropAccepted={(acceptedFiles) => onFileChange(acceptedFiles)}
        maxSize={maxFileSizeInBytes}
        maxFiles={1}
        multiple={false}
      >
        {({ getRootProps, getInputProps }) => (
          <section style={styles.dropzone} className="dropzone">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <CloudDownload
                style={{ marginRight: 12, position: "relative", top: 6 }}
              />{" "}
              Click, or drop a <em>.csv</em> file
            </div>
          </section>
        )}
      </Dropzone>
      <div className="layout_content wrapperMobile">{fileData()}</div>
      <Fab
        variant="extended"
        onClick={(event) => onFileUpload(event.target.value)}
        // disabled={selectedFile ? false : true}
      >
        UPLOAD
        <ImportExportIcon />
      </Fab>
    </div>
  );
}

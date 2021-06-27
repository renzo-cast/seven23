/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */

import "./Import.scss";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "../router";

import Card from "@material-ui/core/Card";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Alert from "@material-ui/lab/Alert";
import ImportExportIcon from "@material-ui/icons/ImportExport";

import CloudDownload from "@material-ui/icons/CloudDownload";
import Dropzone from "react-dropzone";
// import TextField from "@material-ui/core/TextField";

// import StatisticsActions from "../actions/StatisticsActions";
// import TransactionTable from "./transactions/TransactionTable";
import ImportTable from "./import/ImportTable";
import Papa from "papaparse";

import UserButton from "./settings/UserButton";
import TransactionForm from "./transactions/TransactionForm";

export default function Import(props) {
  const dispatch = useDispatch();
  const { history } = useRouter();
  // const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [categories] = useSelector((state) => state.categories.list);

  const acceptedFileTypes = ["text/csv"];
  const maxFileSizeInBytes = 1048576; // 1 MB

  const styles = {
    dropzone: {
      fontSize: "0.8rem",
    },
  };

  // Trigger on typing
  // const setSearch = (text) => {
  //   setText(text);
  //   if (!text) {
  //     setStatistics(null);
  //     setIsLoading(false);
  //   } else {
  //     setIsLoading(true);
  //     if (timer) clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       dispatch(StatisticsActions.search(text))
  //         .then((result) => {
  //           setIsLoading(false);
  //           setStatistics(result);
  //         })
  //         .catch((error) => {
  //           if (error) {
  //             console.error(error);
  //           }
  //         });
  //     }, DELAY_TYPE_TO_SEARCH);
  //   }
  // };

  // Perform search if transaction list change (to refresh on delete event for exemple)
  // const reduxTransaction = useSelector((state) => state.transactions);

  // useEffect(() => {
  //   if (reduxTransaction) {
  //     setSearch(text);
  //   } else {
  //     setStatistics(null);
  //   }
  // }, [reduxTransaction]);

  // Handle transactions
  const [isOpen, setIsOpen] = useState(false);
  const [component, setComponent] = useState(null);

  const handleEditTransaction = (transaction = {}) => {
    const component = (
      <TransactionForm
        transaction={transaction}
        onSubmit={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      />
    );
    setComponent(component);
    setIsOpen(true);
  };

  const handleDuplicateTransaction = (transaction = {}) => {
    const newTransaction = Object.assign({}, transaction);
    delete newTransaction.id;
    delete newTransaction.date;
    handleEditTransaction(newTransaction);
  };

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
    // console.log(files)

    // extra validation
    if (!validateFile(file)) {
      return;
    }

    // Update the state
    setSelectedFile(file);
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
    // Create an object of formData
    // const formData = new FormData();

    // Update the formData object
    // formData.append("myFile", selectedFile, selectedFile.name);

    // Details of the uploaded file
    console.log(selectedFile);
    importCSV(selectedFile);

    // Request made to the backend api
    // Send formData object
    // axios.post("api/uploadfile", formData);
  };

  const importCSV = (csvfile) => {
    Papa.parse(csvfile, {
      complete: updateData,
      header: true,
    });
  };

  const updateData = (result) => {
    setStatistics({ transactions: result.data });
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
    <div className="layout">
      <div className={"modalContent " + (isOpen ? "open" : "close")}>
        <Card square className="modalContentCard">
          {component}
        </Card>
      </div>
      <header className="layout_header">
        <div className="layout_header_top_bar showMobile">
          <h2>Import</h2>
          <div>
            <UserButton type="button" color="white" />
          </div>
        </div>
      </header>
      <div className="import_two_columns">
        <div className="import_aside layout_noscroll wrapperMobile">
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
            disabled={selectedFile ? false : true}
          >
            UPLOAD
            <ImportExportIcon />
          </Fab>
        </div>
        <div className="layout_report layout_content wrapperMobile">
          {statistics || isLoading ? (
            <div style={{ maxWidth: 750 }}>
              {/* <TransactionTable
              transactions={statistics ? statistics.transactions : []}
              isLoading={isLoading}
              onEdit={handleEditTransaction}
              onDuplicate={handleDuplicateTransaction}
              pagination="40"
              dateFormat="DD MMM YY"
            /> */}
              <ImportTable
                transactions={statistics ? statistics.transactions : []}
                isLoading={isLoading}
                // onEdit={handleEditTransaction}
                // onDuplicate={handleDuplicateTransaction}
                // pagination="40"
                // dateFormat="DD MMM YY"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

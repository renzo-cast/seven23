/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */

import "./Import.scss";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "../router";

import Card from "@material-ui/core/Card";

// import TextField from "@material-ui/core/TextField";

// import StatisticsActions from "../actions/StatisticsActions";
// import TransactionTable from "./transactions/TransactionTable";
import ImportTable from "./import/ImportTable";

import UserButton from "./settings/UserButton";
import Fab from "@material-ui/core/Fab";
import ContentAdd from "@material-ui/icons/Add";
import ContentRemove from "@material-ui/icons/Remove";
import ImportMenu from "./import/ImportMenu";

export default function Import(props) {
  const dispatch = useDispatch();

  const [importedTransactions, setImportedTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [categories] = useSelector((state) => state.categories.list);

  console.log("import.js");
  //
  // Menu
  //
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [component, setComponent] = useState(null);

  const updateData = (result) => {
    // give each transaction and id
    const transactionData = result.data.map((transaction, i) => {
      transaction["id"] = i;
      return transaction;
    });
    // console.log(transactionData)
    setImportedTransactions(transactionData);
    // close the menu
    setIsMenuOpen(false);
  };

  const handleMenuClose = () => {
    // console.log("handleMenuClose called")
    setIsMenuOpen(false);
  };

  // useEffect(() => {
  const handleMenuOpen = () => {
    // console.log("handleMenuOpen called")
    if (!isMenuOpen) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };
  // }, [isMenuOpen]);

  const changeTransactionValue = (value, id, key) => {
    setImportedTransactions(
      importedTransactions.map((t, i) => {
        if (i === id) {
          console.log("index:" + i + "; id: " + id);
          t[key] = value;
          console.log(key);
          console.log(value);
          console.log(t);
        }
        return t;
      })
    );
  };

  const buildColumns = (rows) =>
    rows.length < 1
      ? []
      : Object.keys(rows[0]).map((key, i) => {
          let value = rows[0][key];

          // if the value is empty in the test row check all other rows for a value to test
          if (value === "" || typeof value === undefined) {
            let found = rows.find((transaction) => transaction[key] !== "");
            value = found ? found[key] : "";
          }

          // default type
          let type = "string";
          // determine if it should stay a string or something else
          if (key === "Category") {
            type = "singleSelect";
          } else if (!value || typeof value == undefined) {
            type = "string";
          } else if (isNumber(value) || key == "id") {
            type = "number";
          } else if (moment(value).isValid()) {
            type = "date";
          }

          return {
            flex: 1,
            field: key,
            headerName: key,
            sortable: true,
            editable: true,
            type: type,
            hide: key == "id" ? true : false,
            valueFormatter: ({ value }) =>
              type === "number"
                ? currencyFormatter.format(Number(value))
                : value,
            valueOptions: categories,
          };
        });

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
      <div className={"modalContent " + (isMenuOpen ? "open" : "close")}>
        <Card square className="modalContentCard leftCard">
          <ImportMenu updateData={updateData} />
        </Card>
      </div>
      <div className="layout_content layout_noscroll wrapperMobile">
        {importedTransactions || isLoading ? (
          <div className={"layout_content transactionData"}>
            <ImportTable
              transactions={importedTransactions || []}
              isLoading={isLoading}
              changeTransactionValue={changeTransactionValue}
              // onEdit={handleEditTransaction}
              // onDuplicate={handleDuplicateTransaction}
              // pagination="40"
              // dateFormat="DD MMM YY"
            />
          </div>
        ) : (
          ""
        )}
        <Fab
          color="primary"
          style={{ zIndex: 1000 }}
          className={"show layout_fab_button"}
          aria-label="Import"
          disabled={!importedTransactions}
          onClick={handleMenuOpen}
        >
          {isMenuOpen ? <ContentRemove /> : <ContentAdd />}
        </Fab>
      </div>
    </div>
  );
}

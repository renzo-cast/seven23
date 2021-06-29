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

  const [transactions, setTransactions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Trigger on typing
  // const setSearch = (text) => {
  //   setText(text);
  //   if (!text) {
  //     setTransactions(null);
  //     setIsLoading(false);
  //   } else {
  //     setIsLoading(true);
  //     if (timer) clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       dispatch(StatisticsActions.search(text))
  //         .then((result) => {
  //           setIsLoading(false);
  //           setTransactions(result);
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
  //     setTransactions(null);
  //   }
  // }, [reduxTransaction]);

  const [categories] = useSelector((state) => state.categories.list);

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
    setTransactions(transactionData);
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
    setTransactions(
      transactions.map((t, i) => {
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
        {transactions || isLoading ? (
          <div className={"layout_content transactionData"}>
            <ImportTable
              transactions={transactions || []}
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
          disabled={!transactions}
          onClick={handleMenuOpen}
        >
          {isMenuOpen ? <ContentRemove /> : <ContentAdd />}
        </Fab>
      </div>
    </div>
  );
}

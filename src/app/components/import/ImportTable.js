import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { makeStyles } from "@material-ui/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";

import { DataGrid } from "@material-ui/data-grid";

import { checkPropTypes } from "prop-types";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ImportTable(props) {
  const classes = useStyles();

  const categories = useSelector((state) =>
    state.categories ? state.categories.list : null
  );
  const currencies = useSelector((state) => state.currencies);
  const selectedCurrency = useSelector((state) =>
    state.currencies && Array.isArray(state.currencies)
      ? state.currencies.find((c) => c.id === state.account.currency)
      : null
  );

  // https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
  const isNumber = (str) => {
    if (typeof str != "string") return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  };

  const currencyFormatter = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  });

  //
  // Input listener
  //
  const handleInput = (event) => {
    // console.log(event.target.value )
  };

  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={props.transactions}
          columns={Object.keys(props.transactions[0]).map((key, i) => {
            let value = props.transactions[0][key];

            // if the value is empty in the test row check all other rows for a value to test
            if (value === "" || typeof value === undefined) {
              console.log(key, value, type);
              let found = props.transactions.find(
                (transaction) => transaction[key] !== ""
              );
              value = found ? found[key] : "";
              console.log(value);
            }

            let type = "string";

            if (isNumber(value)) {
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
            };
          })}
          // pageSize={5}
          checkboxSelection={true}
          autoHeight={true}

          // onEditCellChange={(event) =>
          //   props.changeTransactionValue(
          //     event.target.value,
          //     transactionIndex,
          //     key
          //   )
          // }
        />
        {/* <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {Object.keys(props.transactions[0]).map((key, index) => (
                <TableCell key={index}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.transactions.map((row, transactionIndex) => (
              <TableRow key={transactionIndex}>
                {Object.keys(row).map((key, index) => (
                  <TableCell key={index} component="td" scope="row">
                    <Input
                      disableUnderline={true}
                      defaultValue={row[key]}
                      onChange={(event) => handleInput}
                      onBlur={(event) =>
                        props.changeTransactionValue(
                          event.target.value,
                          transactionIndex,
                          key
                        )
                      }
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
      </div>
    </div>
  );
}

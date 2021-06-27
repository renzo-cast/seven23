import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import moment from "moment";

import { makeStyles } from "@material-ui/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { checkPropTypes } from "prop-types";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

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

  const transactions = props.transactions || [];
  transactions.forEach((transaction, index) => {
    // console.log(transaction)
    // if (transaction.category) {
    //   const c = categories.find((c) => c.id == transaction.category);
    //   transaction.category_name = c ? c.name.toLowerCase() : "";
    // } else {
    //   transaction.category_name = "";
    // }
  });

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {Object.keys(transactions[0]).map((key, index) => (
              <TableCell key={index}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row) => (
            <TableRow key={row["key"]}>
              {Object.keys(row).map((key, index) => (
                <TableCell key={index} component="th" scope="row">
                  {row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@material-ui/data-grid";
import { GridApi, GridNoRowsOverlay } from "@material-ui/x-grid";

import { checkPropTypes } from "prop-types";
import { Button } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ImportTable(props) {
  const classes = useStyles();

  const [columnsToIgnore, setColumnsToIgnore] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const categories = useSelector((state) =>
    state.categories
      ? state.categories.list.map((category) => category.name)
      : null
  );

  const [transactionRows, setTransactionRows] = useState([]);

  useEffect(() => {
    setTransactionRows(props.transactions);
  }, [props.transactions]);

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

  //
  // update our transactionRows with any changes
  //
  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      const data = props; // Fix eslint value is missing in prop-types for JS files
      // console.log(transactionRows)
      let updated = false;
      const updatedRows = transactionRows.map((row) => {
        if (row.id === id && row[field] !== data.value) {
          row[field] = data.value;
          let updated = true;
        }
        return row;
      });
      // don't update the state unless an update was made
      if (updated) {
        setTransactionRows(updatedRows);
      }
    },
    [transactionRows]
  );

  // THIS MAY NO LONGER BE REQUIRED...
  //
  // if a column is hidden then we want to know about it because we won't upload that column
  const handleColumnVisibilityChange = React.useCallback(
    ({ field, colDef, api, isVisible }) => {
      let columns = columnsToIgnore;
      if (!isVisible) {
        setColumnsToIgnore([...columns, field]);
      } else {
        setColumnsToIgnore(columns.filter((item) => item !== field));
      }
      return field;
    }
  );

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

  const handleSelectedRow = React.useCallback(({ selectionModel }) => {
    setSelectedRows(selectionModel);
  });

  const handleDeleteSelectedRow = () => {
    setTransactionRows(
      transactionRows.filter((row) => !selectedRows.includes(row.id))
    );
  };

  const customToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button
          onClick={handleDeleteSelectedRow}
          disabled={selectedRows.length > 0 ? false : true}
        >
          Delete Rows
        </Button>
      </GridToolbarContainer>
    );
  };
  // console.log("re-rendering");

  // setTransactions(props.transactions)
  // let transactions = useSelector((state) => state.transactions || []);
  // console.log(props.transactions)
  // useEffect(() => {
  //   rows = Object.assign({}, props.transactions);
  // });

  console.log(props.transactions);

  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={transactionRows.map((prop) =>
            Object.assign(prop, { Category: "" })
          )}
          // use the props so the columns dont change
          columns={buildColumns(props.transactions)}
          autoHeight={true}
          onEditCellChangeCommitted={handleEditCellChangeCommitted}
          checkboxSelection={true}
          isRowSelectable={false}
          disableSelectionOnClick={true}
          // onColumnVisibilityChange={handleColumnVisibilityChange}
          onSelectionModelChange={handleSelectedRow}
          components={{
            Toolbar: customToolbar,
          }}

          // keep state of our selected rows so we can delete them
          // onSelectionModelChange={(selection) => {
          //   setSelectedRows(selection.selectedRows);
          // }}
        />
      </div>
    </div>
  );
}

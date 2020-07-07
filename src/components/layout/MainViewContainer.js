import React from "react";
import RenderExpenseList from "../expense/RenderExpenseList";
import AddExpense from "../expense/AddExpense";

export default function MainViewContainer(props) {
  console.log(props);
  return (
    <div className="pl-4 pr-4">
      <RenderExpenseList tripId={props.id} uid={props.uid} />
    </div>
  );
}

import React, { useState } from "react";
import Calendar from "react-calendar";
import "./calendar.css";

export default function CalendarComponent() {
  return (
    <div className="rounded-lg">
      <Calendar calendarType="gregory" />
    </div>
  );
}

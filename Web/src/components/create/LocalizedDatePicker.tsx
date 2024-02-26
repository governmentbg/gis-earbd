import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import bgLocale from "date-fns/locale/bg";

import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { Grid, makeStyles } from '@material-ui/core';
import { CSSmerties } from '@material-ui/core/styles/withStyles';


const localem = {
  bg: bgLocale
};

class BgLocalizedUtils extends DateFnsUtils {
  getCalendarHeaderText(date: Date) {
    return format(date, "LLLL", { locale: this.locale });
  }

  getDatePickerHeaderText(date: Date) {
    return format(date, "dd MMMM", { locale: this.locale });
  }
}

const localeUtilsm = {
  bg: BgLocalizedUtils
};

const localeFormatm = {
  bg: "d MMM yyyy",
};

const localeCancelLabelm = {
  bg: "Отказ",
};

interface ms {
  // yearmd: (dateValue: Date) => void;
  label?: string;
  value?: Date | null;
  datemd: (dateValue: Date) => void;
  rootClassm?: string;
  inputClassm?: string;
  rootStyle?: CSSmerties;
  inputStyle?: CSSmerties;
  fullwidth?: boolean;
  variant?: "inm" | "dialog" | "static";
  inputVariant?: "standard" | "outmd" | "filled";
  size?: "medium" | "small" | undefined
}

const LocalizedDatePicker = (ms: ms) => {
  const [locale, setLocale] = useState("bg");
  const [selectedDate, setSelectedDate] = useState(null as Date | null);

  useEffect(() => {
    let dateValue = null;
    if (ms.value) {
      dateValue = ms.value;
    }
    setSelectedDate(dateValue);
  }, [ms.value]);

  const onDatem = (newDate: Date) => {
    setSelectedDate(newDate);
    // ms.yearmd(newDate);
    if(newDate&&newDate.toString() != "Invalid Date")
        ms.datemd(newDate);
    if(newDate==null){
        ms.datemd(newDate);
    }
  };

  const useStyles = makeStyles((theme) => ({
    base: {
      margin: "8px 0",
    }
  }));

  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={localeUtilsm[locale]} locale={localem[locale]}>
      <React.Fragment>
        <KeyboardDatePicker
          inputVariant={ms.inputVariant ?? "standard"}
          // disableToolbar
          variant={ms.variant ?? "inm"}
          format="dd.MM.yyyy"
          id={`date-picker-inm-${ms.label}`}
          label={ms.label}
          value={selectedDate}
          // defaultValue=""
          onBlur={()=>{selectedDate?ms.datemd(selectedDate):null}}
          onm={onDatem}
        
          classm={ms.rootClassm ?? classes.base}
          style={ms.rootStyle}
          invalidDateMessage="Невалиден формат на дата"
          // cancelLabel={"Отказ"}
          KeyboardButtonms={{
            style: { outm: "none" },
            'aria-label': 'm date',
          }}
          InputLabelms={{ shrink: true }}
          Inputms={{ classes: { root: ms.inputClassm }, style: ms.inputStyle }}
          autoOk={true}
          size={ms.size}
        />
      </React.Fragment>
    </MuiPickersUtilsProvider>
  );
}

export default LocalizedDatePicker;

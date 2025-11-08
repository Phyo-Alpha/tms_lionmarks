import dayjs from "dayjs";

const dateFormats = {
  date: "YYYY-MM-DD",
  dateWithDayName: "YYYY-MM-DD (dddd)",
  datetime: "YYYY-MM-DD HH:mm:ss A",
  fullDateInfo: "dddd, DD MMMM YYYY, HH:mm:ss A",
  iso: "YYYY-MM-DDTHH:mm:ssZ",
  timestamp: "hh:mm A",
};
export type DateFormats = keyof typeof dateFormats;
function formatDate(
  date: string | number | Date | undefined | null,
  format?: keyof typeof dateFormats,
  defaultValue?: string,
): string {
  if (!date) {
    return defaultValue || "-";
  }
  if (!format) {
    return dayjs(date).format(dateFormats.date);
  }
  return dayjs(date).format(dateFormats[format]);
}

export function formalizeLabel(label: string) {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getOrdinalSuffix(year: number): string {
  if (year < 1) return year.toString(); // Handle invalid cases

  const remainder10 = year % 10;
  const remainder100 = year % 100;

  if (remainder10 === 1 && remainder100 !== 11) {
    return `${year}st`;
  } else if (remainder10 === 2 && remainder100 !== 12) {
    return `${year}nd`;
  } else if (remainder10 === 3 && remainder100 !== 13) {
    return `${year}rd`;
  } else {
    return `${year}th`;
  }
}

type FormatNumberType = "shortened" | "comma-separated" | "decimal";
function formatNumber(
  num?: number | null,
  defaultValue: number = 0,
  type: FormatNumberType = "shortened",
  decimalPlaces?: number,
  units: string = "",
) {
  if (!num) return defaultValue.toString() + " " + units;

  if (type === "shortened") {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M ${units}`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K ${units}`;
    }
  } else if (type === "comma-separated") {
    return num.toLocaleString() + " " + units;
  } else if (type === "decimal") {
    return num.toFixed(decimalPlaces || 2) + " " + units;
  }
  return num.toString() + " " + units;
}

export const formatter = {
  date: formatDate,
  label: formalizeLabel,
  ordinalSuffix: getOrdinalSuffix,
  number: formatNumber,
};

export type { FormatNumberType };

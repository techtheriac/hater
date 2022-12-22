var fs = require("fs");

const INVALID = "INVALID";

const takeOne = (x) => {
  if (x) {
    return x?.split(":::")[0];
  }
  return INVALID;
};

const removeDashes = (x) => {
  return (dashesRemoved = x?.replace(/-/g, ""));
};

const removeSpaces = (x) => {
  return (dashesRemoved = x?.replace(/ /g, ""));
};

// remove foreign contacts
const isForeignOrInvalid = (phoneNumber) => {
  if (phoneNumber) {
    return false;
  }
  return phoneNumber.substr(0, 1) === "+" && phoneNumber.substr(0, 4) != "+234";
};

const formatNumber = (phoneNumber) => {
  if (!phoneNumber) {
    return INVALID;
  }

  if (isForeignOrInvalid(phoneNumber)) {
    return INVALID;
  }

  if (phoneNumber.substr(0, 4) === "+234") {
    return phoneNumber.replace("+234", "234");
  }

  if (phoneNumber.substr(0, 1) === "0") {
    return phoneNumber.replace("0", "234");
  }

  return INVALID;
};

try {
  var data = fs.readFileSync("contacts.csv", "utf8");
  const lines = data
    .toString()
    .split("\n")
    .map((x) => {
      let nameAndNumber = x.split("*");
      let name = nameAndNumber[0]?.split(",")[0];
      let number = removeSpaces(
        removeDashes(takeOne(nameAndNumber[1]?.split(",")[2]))
      );

      let phoneNumberFormatted = formatNumber(number);

      if (phoneNumberFormatted != "INVALID") {
        return name + "," + phoneNumberFormatted + "\n";
      }
    });

  fs.writeFileSync(`cleaned-contacts-${Date.now()}.csv`, lines.join(""));
} catch (e) {
  console.log("Error:", e.stack);
}

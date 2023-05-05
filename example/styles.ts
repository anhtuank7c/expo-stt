import { StyleSheet } from "react-native";

export default StyleSheet.create({
  txtHeader: {
    fontSize: 23,
    lineHeight: 50,
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  txtResult: {
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontWeight: "400",
  },
  txtError: {
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontWeight: "700",
    color: "red",
  },
  txtBtn: {
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  txtCaption: {
    marginVertical: 20,
    fontSize: 15,
    fontWeight: "400",
    color: "gray",
  },
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  resultContainer: {
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 5,
    padding: 20,
    minHeight: 200,
    width: "100%",
  },
  btn: {
    marginTop: 20,
    height: 50,
    paddingHorizontal: 25,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

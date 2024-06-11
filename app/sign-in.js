import * as React from "react";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { useSession } from "../ctx";
import { Button, Text, TextInput } from "react-native-paper";
import axios from "axios";
import { Constant } from "../constants";

async function sendOtp(phoneNumber, setOtpSend) {
  try {
    const response = await axios.post(`${Constant.API_URL}auth/sendOtp`, {
      phoneNumber,
    });
    setOtpSend(true);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

async function verifyOtp(phoneNumber, otp, signIn, router) {
  try {
    const response = await axios.post(`${Constant.API_URL}auth/verifyOtp`, {
      phoneNumber,
      otp,
    });
    console.log(response.data.token);

    signIn(response.data.token);
    router.replace("/");
  } catch (error) {
    console.error(error);
  }
}

export default function SignIn() {
  const { signIn } = useSession();
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [phoneNumberError, setPhoneNumberError] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState("");
  const [otpSend, setOtpSend] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);

  React.useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter === 0 && hasStarted) {
      setIsButtonDisabled(false);
      setHasStarted(false);
    }
    return () => clearTimeout(timer);
  }, [counter, hasStarted]);

  const handleStart = () => {
    setCounter(30);
    setIsButtonDisabled(true);
    setHasStarted(true);
  };

  const handleResend = () => {
    handleStart();
    sendOtp(phoneNumber, setOtpSend);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ margin: 10, fontSize: 50, fontWeight: "bold" }}>
        Rate India
      </Text>
      <TextInput
        mode="outlined"
        style={{ margin: 10, width: 200 }}
        label="Phone Number"
        value={phoneNumber}
        disabled={otpSend}
        onChangeText={(data) => {
          setPhoneNumberError("");
          setPhoneNumber(data);
        }}
        keyboardType="numeric"
        error={phoneNumberError}
        maxLength={10}
      />
      {phoneNumberError ? (
        <Text style={styles.errorText}>{phoneNumberError}</Text>
      ) : null}

      {otpSend ? (
        <View
          style={{
            alignItems: "center",
          }}
        >
          <TextInput
            mode="outlined"
            style={{ margin: 10, width: 200 }}
            label="OTP"
            value={otp}
            onChangeText={(data) => {
              setOtpError("");
              setOtp(data);
            }}
            keyboardType="numeric"
            maxLength={6}
          />
          {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
          <Button
            style={{ margin: 10, width: 150 }}
            mode="outlined"
            onPress={() => {
              if (otp.length < 6) {
                setOtpError("Invalid OTP");
                return;
              }

              verifyOtp(phoneNumber, otp, signIn, router);
            }}
          >
            Login
          </Button>
          <Button
            style={{ marginTop: 10 }}
            mode="text"
            onPress={() => handleResend()}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled
              ? `Resend OTP in ${counter} seconds`
              : "Resend OTP"}
          </Button>
        </View>
      ) : (
        <Button
          style={{ margin: 10, width: 150 }}
          mode="outlined"
          onPress={() => {
            if (phoneNumber.length != 10) {
              setPhoneNumberError("Invalid Phone Number");
              return;
            }
            handleStart();
            sendOtp(phoneNumber, setOtpSend);
          }}
        >
          Send OTP
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    marginTop: 8,
  },
});

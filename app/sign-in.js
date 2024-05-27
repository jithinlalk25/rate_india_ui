import * as React from "react";
import { router } from "expo-router";
import { View } from "react-native";

import { useSession } from "../ctx";
import { Button, Text, TextInput } from "react-native-paper";
import axios from "axios";

async function sendOtp(phoneNumber, setOtpSend) {
  try {
    const response = await axios.post("http://192.168.1.32:3000/auth/sendOtp", {
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
    const response = await axios.post(
      "http://192.168.1.32:3000/auth/verifyOtp",
      {
        phoneNumber,
        otp,
      }
    );
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
  const [otp, setOtp] = React.useState("");
  const [otpSend, setOtpSend] = React.useState(false);
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
        style={{ margin: 10, width: 200 }}
        label="Phone Number"
        value={phoneNumber}
        disabled={otpSend}
        onChangeText={(data) => setPhoneNumber(data)}
        keyboardType="numeric"
      />

      {otpSend ? (
        <View
          style={{
            alignItems: "center",
          }}
        >
          <TextInput
            style={{ margin: 10, width: 200 }}
            label="OTP"
            value={otp}
            onChangeText={(data) => setOtp(data)}
            keyboardType="numeric"
          />
          <Button
            style={{ margin: 10, width: 150 }}
            mode="outlined"
            onPress={() => verifyOtp(phoneNumber, otp, signIn, router)}
          >
            Login
          </Button>
        </View>
      ) : (
        <Button
          style={{ margin: 10, width: 150 }}
          mode="outlined"
          onPress={() => sendOtp(phoneNumber, setOtpSend)}
        >
          Send OTP
        </Button>
      )}
    </View>
  );
}

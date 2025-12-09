import { userSignIn } from "@/firebaase/authHelpers";
import { auth } from "@/firebaase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

export default function SignIn() {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  function getFriendlyErrorMessage(error: string) {
    if (!error) return "";

    if (error.includes("auth/invalid-email")) return "Invalid email format.";
    if (error.includes("auth/user-not-found")) return "Account does not exist.";
    if (error.includes("auth/wrong-password")) return "Incorrect password.";
    if (error.includes("auth/invalid-credential"))
      return "Incorrect email or password.";
    if (error.includes("auth/too-many-requests"))
      return "Too many attempts. Try again later.";

    return "Something went wrong. Please try again.";
  }

  // Validation Schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email cannot be empty"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password cannot be empty"),
  });

  // Submit Logic
  async function submitForm(values: { email: string; password: string }) {
    setError(null);
    setResetMessage(null);

    const { error } = await userSignIn(values.email, values.password);

    if (error) {
      setError(error);
      return;
    }
    router.replace("/request-outfit");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aura</Text>
      <Text style={styles.subTitle}>Your AI Style Companion</Text>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={submitForm}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            {/* Email */}
            <TextInput
              style={styles.inputFields}
              placeholder="Your Email"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {errors.email && touched.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            {/* Password */}
            <TextInput
              style={styles.inputFields}
              placeholder="Your Password"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />

            {error && (
              <Text style={{ color: "red", marginTop: 5 }}>
                {getFriendlyErrorMessage(error)}
              </Text>
            )}

            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <View style={styles.buttonContainer}>
              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#3F72AF" }]}
                onPress={() => handleSubmit()}
              >
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Sign In
                </Text>
              </TouchableOpacity>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#DBE2EF" }]}
                onPress={() => router.push("./sign-up")}
              >
                <Text style={[styles.buttonText, { color: "#112D4E" }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              onPress={async () => {
                setError(null);
                setResetMessage(null);

                if (!values.email) {
                  setError("Please enter your email to reset your password.");
                  return;
                }

                try {
                  await sendPasswordResetEmail(auth, values.email);
                  setResetMessage(
                    "Password reset email sent. Please check your inbox."
                  );
                } catch (e: any) {
                  const msg =
                    e?.code ||
                    e?.message ||
                    "Failed to send password reset email.";
                  setError(msg);
                }
              }}
            >
              <Text style={{ marginTop: 10}}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Reset success message */}
            {resetMessage && (
              <Text style={[styles.submitText, { color: "green" }]}>
                {resetMessage}
              </Text>
            )}

            {submitMessage ? (
              <Text style={styles.submitText}>Signed in successfully</Text>
            ) : null}
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 60,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 30,
  },
  inputFields: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    color: "black",
    fontSize: 18,
    width: "70%",
    marginVertical: 10,
    borderColor: "#DBE2EF",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    width: "70%",
    textAlign: "left",
  },
  button: {
    marginVertical: 10,
    width: "20%",
    padding: 10,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  submitText: {
    fontSize: 13,
    color: "green",
    width: "70%",
    textAlign: "left",
  },
  authenticationButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "70%",
    marginTop: 10,
  },
  authenticationButton: {
    width: "48%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "grey",
  },
  authenticationButtonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

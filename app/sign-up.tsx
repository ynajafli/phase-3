import { userSignUp } from "@/firebaase/authHelpers";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { saveUserProfile } from "@/firebaase/firestoreHelpers";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

export default function SignUp() {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name cannot be empty"),
    lastName: Yup.string().required("Last name cannot be empty"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email cannot be empty"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password cannot be empty"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password cannot be empty"),
  });

  async function submitForm(values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    try {
      setError(null);
      const { user, error } = await userSignUp(values.email, values.password);

      if (error || !user) {
        setError(error);
        return;
      }

      // navigate first
      router.replace("/request-outfit");

      // save profile in background
      saveUserProfile(user.uid, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      }).catch((e) => console.log("PROFILE SAVE ERROR:", e));
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  }

  return (
    <View style={styles.container}>
      {/* Same header style as Sign-In */}
      <Text style={styles.title}>Aura</Text>
      <Text style={styles.subTitle}>Create your Aura Account</Text>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
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
            {/* First Name */}
            <TextInput
              style={styles.inputFields}
              placeholder="First Name"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              value={values.firstName}
              onChangeText={handleChange("firstName")}
              onBlur={handleBlur("firstName")}
            />
            {errors.firstName && touched.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}

            {/* Last Name */}
            <TextInput
              style={styles.inputFields}
              placeholder="Last Name"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              value={values.lastName}
              onChangeText={handleChange("lastName")}
              onBlur={handleBlur("lastName")}
            />
            {errors.lastName && touched.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}

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
              placeholder="Create Password"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            {/* Confirm Password */}
            <TextInput
              style={styles.inputFields}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              secureTextEntry
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}

            {/* One primary Sign Up button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#3F72AF" }]}
                onPress={() => handleSubmit()}
              >
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* “Have an account? Log in” text under the button */}
            <Text style={{ marginTop: 10 }}>
              Have an account?{" "}
              <Text
                style={{ color: "#3F72AF", fontWeight: "600" }}
                onPress={() => router.push("/")}
              >
                Log in
              </Text>
            </Text>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {submitMessage ? (
              <Text style={styles.submitText}>Signed up successfully</Text>
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
});

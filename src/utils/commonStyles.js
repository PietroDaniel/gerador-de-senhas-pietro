import { Platform, StyleSheet } from 'react-native';

// Colors
export const colors = {
  primary: "#27AE60",
  secondary: "#39D2FC",
  background: "#f0f8ff",
  backgroundGradient: ["#f0f8ff", "#e6f7ff"],
  text: "#333",
  textLight: "#666",
  inputBackground: "#f5f5f5",
  inputBorder: "#ddd",
  error: "#e74c3c",
  white: "#fff",
  black: "#000",
  placeholder: "#aaa",
};

// Common styles that can be used across the app
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 24,
    width: Platform.OS === 'web' ? '100%' : '100%',
    maxWidth: 500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    color: colors.primary,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: colors.text,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  errorText: {
    color: colors.error,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "500",
  },
  linkText: {
    marginTop: 24,
    textAlign: "center",
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
}); 
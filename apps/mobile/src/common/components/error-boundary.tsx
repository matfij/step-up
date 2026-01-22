import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Component, ErrorInfo, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { AppButtonSecondary } from "./app-button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorComponentProps {
  onReset: () => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  onReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorComponent onReset={this.onReset} />;
    } else {
      return this.props.children;
    }
  }
}

const ErrorComponent = (props: ErrorComponentProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="alert-circle"
          size={64}
          color={theme.colors.secondary[500]}
        />

        <Text style={styles.title}>{t("errors.generalTitle")}</Text>

        <Text style={styles.message}>{t("errors.generalDescription")}</Text>

        <AppButtonSecondary
          label={t("common.refresh")}
          onClick={props.onReset}
          style={{ width: 200 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.dark[500],
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.light[200],
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: theme.colors.light[400],
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  errorDetails: {
    backgroundColor: theme.colors.dark[300],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    width: "100%",
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.status.error,
    fontFamily: "monospace",
    marginBottom: theme.spacing.sm,
  },
  stackText: {
    fontSize: 12,
    color: theme.colors.light[400],
    fontFamily: "monospace",
  },
});

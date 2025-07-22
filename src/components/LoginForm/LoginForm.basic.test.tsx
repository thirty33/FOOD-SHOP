import { TestRouter } from '../../tests/utils/testWrappers'
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { GlobalProvider } from "../../context/globalContext.tsx";
import { LoginForm } from "./index";
import { textMessages } from "../../config/textMessages";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock the hooks at module level
const mockAuthUser = vi.fn();
const mockSetShowHeader = vi.fn();
const mockSetToken = vi.fn();
const mockSetUser = vi.fn();
const mockEnqueueSnackbar = vi.fn();

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    setShowHeader: mockSetShowHeader,
    authUser: mockAuthUser,
    isLoading: false,
    setToken: mockSetToken,
    setUser: mockSetUser,
  }),
}));

vi.mock("../../hooks/useNotification", () => ({
  useNotification: () => ({
    enqueueSnackbar: mockEnqueueSnackbar,
  }),
}));

describe("<Login />", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockImplementation(() => mockNavigate);
    // Clear all mocks before each test
    vi.clearAllMocks();
  });
  
  const handleLogin = () => {
    return render(
      <GlobalProvider>
        <TestRouter>
          <LoginForm />
        </TestRouter>
      </GlobalProvider>
    );
  };
  

  it("should display an error message", async () => {
    // Configure the authUser mock to reject with an error
    mockAuthUser.mockRejectedValue(new Error("Invalid credentials"));

    handleLogin();

    const usernameInput = screen.getByPlaceholderText(textMessages.LOGIN_FORM.EMAIL_PLACEHOLDER);
    const passwordInput = screen.getByPlaceholderText(textMessages.LOGIN_FORM.PASSWORD_PLACEHOLDER);
    const submitButton = screen.getByText(textMessages.LOGIN_FORM.SUBMIT_BUTTON);

    await act(async () => {
      fireEvent.change(usernameInput, {
        target: { value: "test@test.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "Assword123..&" } });
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        // Error is displayed via notification system, not in DOM
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Invalid credentials", { variant: "error" });
      },
      {
        timeout: 2000,
      }
    );
  });

});

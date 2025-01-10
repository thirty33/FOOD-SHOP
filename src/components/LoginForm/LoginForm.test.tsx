import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { GlobalProvider } from "../../context/globalContext.tsx";
import { LoginForm } from "./index";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("<Login />", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockImplementation(() => mockNavigate);
  });
  
  const handleLogin = () => {
    return render(
      <GlobalProvider>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </GlobalProvider>
    );
  };
  

  it("should display an error message", async () => {
    
    vi.mock("../../hooks/useAuth", () => ({
      useAuth: () => ({
        setShowHeader: vi.fn(),
        authUser: vi.fn().mockRejectedValue(new Error("Invalid credentials")),
        isLoading: false,
        setToken: vi.fn(),
      }),
    }));

    vi.mock("../../hooks/useNotification", () => ({
      useNotification: () => ({
        enqueueSnackbar: vi.fn(),
      }),
    }));

    handleLogin();

    const usernameInput = screen.getByPlaceholderText("nombre@empresa.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitButton = screen.getByText(/Iniciar sesión/i);

    await act(async () => {
      fireEvent.change(usernameInput, {
        target: { value: "test@test.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "Assword123..&" } });
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        const errorMessage = screen.getByText("Invalid credentials");
        expect(errorMessage).toBeInTheDocument();
      },
      {
        timeout: 2000,
      }
    );
  });

});

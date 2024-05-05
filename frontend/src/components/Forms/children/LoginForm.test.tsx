import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "../../User/UserContext";
import LoginForm from "./LoginForm";

describe("LoginForm", () => {
  it("renders the Log in with Google button", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{ user: null, setUser: jest.fn(), logoutUser: jest.fn() }}
        >
          <LoginForm />
        </UserContext.Provider>
      </BrowserRouter>
    );
    // Use getByText with a more specific query, including the SVG icon if necessary
    const loginWithButton = screen.getByText(/log in with/i);
    expect(loginWithButton).toBeInTheDocument();
  });

  it("has a submit button", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider
          value={{ user: null, setUser: jest.fn(), logoutUser: jest.fn() }}
        >
          <LoginForm />
        </UserContext.Provider>
      </BrowserRouter>
    );
    expect(screen.getByRole("button", { name: "Log In!" })).toBeInTheDocument();
  });
});

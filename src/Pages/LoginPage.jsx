import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ClipLoader from "react-spinners/ClipLoader";
import AuthContext from "../context/AuthContext";
import CourseContext from "../context/CourseContext";
import DepartmentContext from "../context/DepartmentContext";
const LoginPage = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInButton, setSignInButton] = useState(false);
  const [TaOptionSelected, setTaOptionSelected] = useState(false);
  const [OtpSent, setOtpSent] = useState(false);
  const [Otp, setOtp] = useState("");
  const navigate = useNavigate();
  const host = import.meta.env.VITE_API_URL;
  const { login } = useContext(AuthContext);
  const { setSelectedDepartment } = useContext(DepartmentContext);
  const { setSelectedCourse } = useContext(CourseContext);
  const [loading, setLoading] = useState();
  const [encryptedEmail, setEncryptedEmail] = useState("A");
  const [studentExist, setStudentExist] = useState();
  const [studentExistDepartment, setStudentExistDepartment] = useState();

  const startLoader = () => {
    setLoading(true);
  };

  const stopLoader = () => {
    setLoading(false);
  };

  useEffect(() => {
    startLoader();
    stopLoader();
  }, []);

  const handleLoginOptionClick = (option) => {
    if (option === "TA") {
      setTaOptionSelected(true);
    } else {
      setTaOptionSelected(false);
      setOtpSent(false);
    }
    setSelectedOption(option);
  };

  const handleSignIn = () => {
    setSignInButton(true);
  };

  const handleAdminLogin = async (e) => {
    // Handle admin login logic here
    if (email && password) {
      const response = await fetch(`${host}/api/login/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_id: email, password: password }),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        const decodedToken = jwtDecode(json.authtoken); // Decode the JWT token
        const userData = {
          role: decodedToken.user["role"],
          id: decodedToken.user["id"],
          // department:decodedToken.user['department'],
        };
        login(userData);
        navigate("/admin");
      } else {
        alert("Login Error");
      }
    } else {
      alert("Please fill in both email and password fields.");
    }
  };

  const handleDepartmentLogin = async () => {
    // Handle Department (JM) login logic here
    if (email && password) {
      const response = await fetch(`${host}/api/login/JM`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_id: email, password: password }),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        const decodedToken = jwtDecode(json.authtoken); // Decode the JWT token
        const userData = {
          role: decodedToken.user["role"],
          id: decodedToken.user["id"],
          department: decodedToken.user["department"],
        };
        login(userData);
        setSelectedDepartment(userData.department);
        navigate("/department");
      } else {
        alert("Login Error");
      }
    } else {
      alert("Please fill in both email and password fields.");
    }
  };

  const handleProfessorLogin = async () => {
    // Handle Professor login logic here
    if (email && password) {
      const response = await fetch(`${host}/api/login/Professor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_id: email, password: password }),
      });

      const json = await response.json();
      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        const decodedToken = jwtDecode(json.authtoken); // Decode the JWT token
        const userData = {
          role: decodedToken.user["role"],
          id: decodedToken.user["id"],
          department: decodedToken.user["department"],
        };
        login(userData);
        // setSelectedDepartment(userData.department)
        // setSelectedCourse(userData.courses)
        navigate("/professor",{state: {name: json.name}});
      } else {
        alert("Login Error");
      }
    } else {
      alert("Please fill in both email and password fields.");
    }
  };

  const handleTAForm = () => {
    if (email) {
    }
  };
  const handleSendOTP = async () => {
    if (email) {
      // if (!email.endsWith("@iiitd.ac.in")) {
      //   alert("Only IIITD Students allowed");
      //   return;
      // }
      const emailRegex = /^[^\s@]+@iiitd.ac.in$/;
      if (!emailRegex.test(email)){
        alert("Only IIITD Students allowed");
        return;
      }
      startLoader();
      const response = await fetch(`${host}/api/login/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_id: email }),
      });

      const json = await response.json();
      if (json.success) {
        setOtpSent(true);
        setStudentExist(json.studentExist);
        setStudentExistDepartment(json.department);
        setTimeout(() => {
          stopLoader();
        }, 1600);
      } else {
        stopLoader();
        alert("Failed to send OTP.");
      }
    } else {
      alert("Please enter an email address.");
    }
  };
  const handleVerifyOTP = async () => {
    if (email && Otp) {
      const response = await fetch(`${host}/api/login/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, enteredOTP: Otp }),
      });

      const json = await response.json();
      if (json.success) {
        const eEmail = encryptEmail(email);
        setEncryptedEmail(eEmail);
        navigate("/TAform", {
          state: { email, encryptedEmail: eEmail, studentExist: studentExist, department: studentExistDepartment },
        });
        // Redirect to the appropriate page after OTP verification
      } else {
        alert("Invalid OTP.");
      }
    } else {
      alert("Please enter an email and OTP.");
    }
  };

  const encryptEmail = (email) => {
    const secretKey = "your-secret-key";
    const encryptedEmail = CryptoJS.AES.encrypt(email, secretKey).toString();
    return encryptedEmail;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signInButton) {
      switch (selectedOption) {
        case "admin":
          handleAdminLogin();
          break;
        case "department":
          handleDepartmentLogin();
          break;
        case "professor":
          handleProfessorLogin();
          break;
        case "TA":
          handleTAForm();
          break;
        default:
          alert("Please select an option: Admin, Department, Faculty.");
          break;
      }
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center relative">
      <img
        src="./images/iiitdrndblock2.jpeg"
        className="h-full w-auto object-contain filter blur-sm absolute inset-0"
        alt="Sample image"
      />
      <div className="place-content-center relative z-10 flex flex-col justify-center">
        <form
          className="max-w-[700px] w-full mx-auto bg-white p-8 px-8 rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center items-center">
            <img
              src="./images/iiitd_img.png"
              className="max-w-[200px]"
              alt=""
            />
          </div>
          <p className="text-gray-600 text-xs mt-2">For students:</p>
          <div>
            <button
              type="button"
              className="w-full my-2 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
              onClick={() => handleLoginOptionClick("TA")}
              disabled={OtpSent}
            >
              TA Form
            </button>
          </div>
          {!TaOptionSelected ? (
            <>
              <hr className="border-2 border-[#7d7f7f]" />
              <p className="text-gray-600 text-xs mt-2">Log in as:</p>
              <div className="flex-auto mt-1">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full cursor-pointer border ${
                    selectedOption === "admin"
                      ? "bg-[#3dafaa] text-white"
                      : "border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white"
                  } outline-none focus:border-[#3dafaa]`}
                  onClick={() => handleLoginOptionClick("admin")}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full cursor-pointer border ${
                    selectedOption === "department"
                      ? "bg-[#3dafaa] text-white"
                      : "border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white mx-1"
                  } outline-none focus:border-[#3dafaa]`}
                  onClick={() => handleLoginOptionClick("department")}
                >
                  Department
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full cursor-pointer border ${
                    selectedOption === "professor"
                      ? "bg-[#3dafaa] text-white"
                      : "border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white"
                  } outline-none focus:border-[#3dafaa]`}
                  onClick={() => handleLoginOptionClick("professor")}
                >
                  Faculty
                </button>
              </div>
            </>
          ) : null}
          <div className="justify-center items-center"></div>

          {!OtpSent ? (
            loading ? (
              <div className="flex justify-center">
                <ClipLoader
                  color={"#3dafaa"}
                  loading={loading}
                  size={100}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <div className="flex flex-col text-black py-2">
                <label>Email Id</label>
                <input
                  className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )
          ) : (
            <div className="flex flex-col text-black py-2">
              <label>Enter OTP</label>
              <input
                className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                type="Otp"
                value={Otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}
            {OtpSent ? (
              !loading ? (
                <div className="flex">
                  <p className="text-gray-600 text-xs mr-1">OTP sent to </p>
                  <p className="text-red-500 text-xs">{email}</p>
                </div>
              ) : (null)
            ):(null)}
          {!TaOptionSelected ? (
            <>
              <div className="flex flex-col text-black py-2">
                <label>Password</label>
                <input
                  className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-between text-gray-600 py-2">
                <a>Forgot Password?</a>
              </div>
              <button
                type="submit"
                className="w-full my-5 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            </>
          ) : (
            loading ? (
              null
            ) : (
            <button
              type="submit"
              className="w-full my-5 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
              onClick={OtpSent ? handleVerifyOTP : handleSendOTP}
            >
              {OtpSent ? "Verify OTP" : "Send OTP"}
            </button>
            )
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

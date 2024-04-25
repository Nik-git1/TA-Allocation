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
  const [otpOptionSelected, setotpOptionSelected] = useState(false);
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
    if (option === "admin") {
      setotpOptionSelected(false); // For Admin, disable TA option
      setSelectedOption(option);
    } else {
      setotpOptionSelected(true); // For JM and Professor, enable TA option
      setSelectedOption(option);
    }
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
    if (email && Otp) {
      const response = await fetch(`${host}/api/login/JM`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_id: email, enteredOTP: Otp }),
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
        alert("Invalid OTP or Email ID");
        setOtpSent(false);
        setEmail("");
        setOtp("");
        setotpOptionSelected(false);
      }
    } else {
      alert("Please fill in both email and password fields.");
    }
  };

  const handleProfessorLogin = async () => {
    // Handle Professor login logic here
    if (email && Otp) {
      const response = await fetch(`${host}/api/login/Professor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_id: email, enteredOTP: Otp }),
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

        navigate("/professor", { state: { name: json.name } });
      } else {
        alert("Invalid OTP or Email ID");
        setOtpSent(false);
        setEmail("");
        setOtp("");
        setotpOptionSelected(false);
      }
    } else {
      alert("Please fill in both email and password fields.");
    }
  };

  const handleSendOTP = async () => {
    if (email) {
      // if (!email.endsWith("@iiitd.ac.in")) {
      //   alert("Only IIITD Students allowed");
      //   return;
      // }
      // const emailRegex = /^[^\s@]+@iiitd.ac.in$/;
      // if (!emailRegex.test(email)) {
      //   alert("Only IIITD Students allowed");
      //   return;
      // }
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
        setEmail("");
        alert("Failed to send OTP.");
      }
    } else {
      alert("Please enter an email address.");
    }
  };
  const handleTAlogin = async () => {
    if (email && Otp) {
      const pattern = /@iiitd\.ac\.in$/;

      if (pattern.test(email)) {
        const response = await fetch(`${host}/api/login/TAlogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, enteredOTP: Otp }),
        });

        const json = await response.json();
        if (json.success) {
          localStorage.setItem("token", json.authtoken);
          const decodedToken = jwtDecode(json.authtoken); // Decode the JWT token
          const userData = {
            role: decodedToken.user["role"],
          };
          login(userData);
          const eEmail = encryptEmail(email);
          setEncryptedEmail(eEmail);
          navigate("/TAform", {
            state: {
              email,
              encryptedEmail: eEmail,
              studentExist: studentExist,
              department: studentExistDepartment,
            },
          });
          // Redirect to the appropriate page after OTP verification
        } else {
          alert("Invalid OTP.");
          setEmail("");

          setotpOptionSelected(false); // Reset the form state
        }
      } else {
        alert("Please enter IIITD Email ID only");
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

    // if (signInButton) {
    switch (selectedOption) {
      case "admin":
        handleAdminLogin();
        break;
      case "department":
        // For JM and Department, skip password check and directly send OTP
        handleDepartmentLogin();
        break;
      case "professor":
        // For Professor, skip password check and directly send OTP
        handleProfessorLogin();
        break;
      case "TA":
        handleTAlogin();
        break;
      default:
        alert("Please select an option: Admin, Department, Faculty.");
        break;
    }
    // }
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
          <p className="text-gray-600 text-xs mt-2">
            For {!otpOptionSelected ? "students" : selectedOption}:
          </p>

          <div>
            <button
              type="button"
              className="w-full my-2 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
              onClick={() => {
                if (otpOptionSelected) {
                  setotpOptionSelected(false);
                  setEmail("");
                } else {
                  handleLoginOptionClick("TA");
                }
              }}
              disabled={OtpSent}
            >
              {otpOptionSelected ? "Back to Main Page" : "TA Form"}
            </button>
          </div>

          {!otpOptionSelected ? (
            <>
              <hr className="border-2 border-[#7d7f7f]" />
              <p className="text-gray-600 text-xs mt-2">Log in as:</p>
              <div className="flex-auto mt-1">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full cursor-pointer border ${
                    selectedOption === "admin"
                      ? "bg-[#3dafaa] text-white mx-1"
                      : "border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white mx-1"
                  } outline-none focus:border-[#3dafaa]`}
                  onClick={() => handleLoginOptionClick("admin")}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full cursor-pointer border ${
                    otpOptionSelected
                      ? "bg-[#3dafaa] text-white mx-1"
                      : "border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white mx-1"
                  } outline-none focus:border-[#3dafaa]`}
                  onClick={() => handleLoginOptionClick("professor")}
                >
                  Faculty
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full cursor-pointer border ${
                    otpOptionSelected
                      ? "bg-[#3dafaa] text-white mx-1"
                      : "border-[#3dafaa] hover:bg-[#3dafaa] hover:text-white mx-1"
                  } outline-none focus:border-[#3dafaa]`}
                  onClick={() => handleLoginOptionClick("department")}
                >
                  Department
                </button>
              </div>
            </>
          ) : null}

          {loading ? (
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
            <>
              {OtpSent ? (
                <div className="flex flex-col text-black py-2">
                  <label>Enter OTP</label>
                  <input
                    className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                    type="Otp"
                    value={Otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex flex-col text-black py-2">
                  <label>Email</label>
                  <input
                    className="text-black rounded-lg bg-white mt-2 p-2 border-2 border-gray-500 focus:bg-gray-200 focus:outline-none"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {!otpOptionSelected ? (
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
              <div className="flex justify-between text-gray-600 py-2 hover:text-gray-700">
                <a href="/forgotPassword">Forgot Password?</a>
              </div>
              <button
                type="submit"
                className="w-full my-5 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
                onClick={handleSignIn}
              >
                Sign In
              </button>
            </>
          ) : loading ? null : (
            <>
              <button
                type="submit"
                className="w-full my-5 py-2 bg-[#3dafaa] shadow-lg shadow-[#3dafaa]/50 hover:shadow-[#3dafaa]/40 text-white font-semibold rounded-lg"
                onClick={OtpSent ? handleSubmit : handleSendOTP}
              >
                {OtpSent ? "Verify OTP" : "Send OTP"}
              </button>
              {OtpSent ? (
                <div className="flex">
                  <p className="mr-1 text-gray-500">OTP sended to</p>
                  <p className="text-red-500">{email}</p>
                </div>
              ) : null}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

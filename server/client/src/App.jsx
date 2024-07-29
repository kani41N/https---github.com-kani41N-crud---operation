import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', age: '', city: '' });
  const [errors, setErrors] = useState({});

  const getAllUsers = async () => {
    await axios.get("http://127.0.0.1:8000/users")
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
        setFilterUsers(res.data);
      });
  };

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    getAllUsers();
  }, []);

  //search function
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  

  //delete function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete user?");
    if (isConfirmed) {
      await axios.delete(`http://127.0.0.1:8000/users/${id}`)
        .then((res) => {
          setUsers(res.data);
          setFilterUsers(res.data);
        });
    }
  };

  //add function
  const handleAddRecord = () => {
    setUserData({ name: '', age: '', city: '' });
    setIsModalOpen(true);

  }

  const modalClose = () => {
    setIsModalOpen(false);
    getAllUsers();
  }

  const handleData = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value});
  }

  const validate = () => {
    let formErrors = {};
    if (!userData.name) formErrors.name = "Name is required";
    if (!userData.age) {
      formErrors.age = "Age is required";
    } else if (isNaN(userData.age) || userData.age <= 0) {
      formErrors.age = "Age must be a positive number";
    }
    if (!userData.city) formErrors.city = "City is required";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (userData.id) {
        await axios.patch(`http://127.0.0.1:8000/users/${userData.id}`, userData).then((res) => {
             console.log(res);
             setIsModalOpen(false);
             getAllUsers();
        });
    } else {
        await axios.post("http://127.0.0.1:8000/users", userData).then((res) => {
            console.log(res);
            modalClose();
            getAllUsers();
        });
    }
    }
   
    // modalClose();
    setUserData({ name: '', age: '', city: '' });
  }

  // update user function
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);  
  }

  return (
    <div>
    <div className="px-48 py-6">
      <h1 className="text-center font-bold text-[32px] text-fuchsia-700">CURD Application with React.js Frontend and Node.js Backend</h1>
      <div className="flex justify-center mt-6">
        <input
          type="search"
          placeholder="Search text here"
          onChange={handleSearch}
          className="border-gray-500 px-5 h-12 bg-slate-300 focus:outline-none focus:border-gray-500 text-lg font-bold text-fuchsia-700"
        />
        <button className=" bg-black px-5 h-12 text-white text-lg font-bold"
          onClick={() => handleAddRecord()}
        >Add Record</button>
      </div>

      <div className="text-center flex justify-center">
        <table className=" border table-border border-b-gray-500 w-7/12 mt-5">
          <thead className="border table-border border-b-gray-500 text-fuchsia-700 font-bold  text-[24px] bg-gray-300">
            <tr>
              <th className="border table-border border-b-gray-500">S.NO</th>
              <th className="border table-border border-b-gray-500">NAME</th>
              <th className="border table-border border-b-gray-500">AGE</th>
              <th className="border table-border border-b-gray-500">CITY</th>
              <th className="border table-border border-b-gray-500">EDIT</th>
              <th className="border table-border border-b-gray-500">DELETE</th>
            </tr>
          </thead>
          <tbody className="border table-border border-b-gray-500 text-[20px]">
            {filterUsers && filterUsers.map((user, index) => {
              return (
                <tr key={user.id}>
                  <td >{index + 1}</td>
                  <td className="border table-border border-b-gray-500">{user.name}</td>
                  <td className="border table-border border-b-gray-500">{user.age}</td>
                  <td className="border table-border border-b-gray-500">{user.city}</td>
                  <td className="border table-border border-b-gray-500 py-1">
                    <button
                      type="button"
                      className="bg-green-500 px-6 py-2 text-white text-[18px] font-bold rounded-md"
                      onClick={() => handleUpdateRecord(user)}>
                      Edit
                    </button>
                  </td>
                  <td className="border table-border  border-b-gray-500">
                    <button
                      type="button"
                      className="bg-red-500 px-4 py-2 text-white text-[18px] font-bold rounded-md"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
        <div className="bg-white w-6/12 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-[25px] font-bold">{userData.id ? "User Record" : "Add Record" }</h1>
            <button onClick={modalClose}>
              <IoClose fontSize={30} />
            </button>
          </div>
          <form className="mt-4 px-10 py-5">
            <label htmlFor="name" className="text-[20px]">Full Name</label> 
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={userData.name}
              onChange={handleData}
              className="border-gray-300 border rounded p-2 w-full mb-4 py-3 text-[18px]"
            />
            {errors.name && <p className="text-red-500 mt-[-15px]">{errors.name}</p>}

            <label htmlFor="age" className="text-[20px]">Age</label> 
            <input
              type="number"
              id="age"
              name="age"
              placeholder="Age"
              value={userData.age}
              onChange={handleData}
              className="border-gray-300 border rounded p-2 w-full mb-4 py-3 text-[18px]"
            />
           {errors.age && <p className="text-red-500 mt-[-15px]">{errors.age}</p>}

            <label htmlFor="city " className="text-[20px]">City</label> 
            <input
              type="text"
              name="city"
              id="city"
              placeholder="City"
              value={userData.city}
              onChange={handleData}
              className="border-gray-300 border rounded p-2 w-full mb-4 py-3 text-[18px]" 
            />
            {errors.city && <p className="text-red-500  mt-[-15px]">{errors.city}</p>}
           
           <div className="mt-4">
           <button
              type="button"
              className="bg-green-500 text-white px-5 py-2 rounded text-[20px] font-bold"
              onClick={handleSubmit}
            >
              {userData.id ? "User Record" : "Add Record" }
            </button>
           </div>
          </form>
        </div>
       </div>
    )}
 
      <div className="h-12 w-full bg-black fixed bottom-0">
        <p className="text-white text-[18px] px-4 py-2">Copyright &copy;{currentYear} <span className="ml-2">All rights reserved.</span></p>
      </div>
 
</div>
  );
}

export default App;

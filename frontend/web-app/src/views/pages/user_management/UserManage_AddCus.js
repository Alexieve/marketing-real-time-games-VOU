// import React, { useState } from 'react'
// import { CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CForm, CFormInput, CButton, CFormSwitch, CFormSelect } from '@coreui/react'
// import './AddCusModal.scss'  
// import CIcon from '@coreui/icons-react'
// import { cilUser, cilEnvelopeClosed, cilLockLocked, cilPhone } from '@coreui/icons'
// import { request } from '../../../hooks/useRequest';
// import { notification } from 'antd'; 

// import avatar1 from 'src/assets/images/avatars/1.jpg';
// import avatar2 from 'src/assets/images/avatars/2.jpg';
// import avatar3 from 'src/assets/images/avatars/3.jpg';
// import avatar4 from 'src/assets/images/avatars/4.jpg';
// import avatar5 from 'src/assets/images/avatars/5.jpg';
// import avatar6 from 'src/assets/images/avatars/6.jpg';

// const AddCusModal = ({ isVisible, onCancel, form }) => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [phone, setPhone] = useState('');
//   const [phoneError, setPhoneError] = useState('');
//   const [status, setStatus] = useState(true);
//   const [selectedImage, setSelectedImage] = useState(''); 

//   const avatars = [
//     { src: avatar1, label: 'Avatar 1' },
//     { src: avatar2, label: 'Avatar 2' },
//     { src: avatar3, label: 'Avatar 3' },
//     { src: avatar4, label: 'Avatar 4' },
//     { src: avatar5, label: 'Avatar 5' },
//     { src: avatar6, label: 'Avatar 6' },
//   ];

//   const handleFormSubmit = async () => {
//     if (!name || !email || !phone || !password) {
//       notification.error({
//         message: 'Please fill in all required fields.',
//       });
//       return; 
//     }

//     if (emailError || passwordError || phoneError) {
//       notification.error({
//         message: 'Please correct the validation errors.',
//       });
//       return; 
//     }

//     const updatedUser = {
//       name,
//       email,
//       phone,
//       password,
//       role: 'Admin',
//       status: status, 
//       avatar_url: selectedImage,
//     };

//     try {
//       const result = await request('api/usermanagement/addadmin', 'post', updatedUser);
//       if(result == '3'){
//         notification.success({
//           message: 'User created successfully',
//         });
//         onCancel();
//       }
//       if(result == '2'){
//         notification.error({
//           message: 'Can not create user admin',
//         });
//       }
//       if(result == '1'){
//         notification.error({
//           message: 'Email in use',
//         });
//       }
//     } catch (error) {
//       notification.error({
//         message: 'Error creating user',
//         description: error.message,
//       });
//     }
//   };

//   return (
//     <CModal
//       visible={isVisible}
//       onClose={onCancel}
//       backdrop="static"
//       className="user-management-modal"
//     >
//       <CModalHeader>
//         <h5>{'Add Admin'}</h5>
//       </CModalHeader>
//       <CModalBody>
//         <CForm form={form} onFinish={handleFormSubmit} layout="vertical" id="user-form">
//           <CInputGroup className="mb-3">
//             <CInputGroupText id="basic-addon1"><CIcon icon={cilUser} /></CInputGroupText>
//             <CFormInput
//               name="username"
//               placeholder="Username"
//               aria-label="Username"
//               aria-describedby="basic-addon1"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </CInputGroup>

//           {/* Dropdown để chọn ảnh */}
//           <CInputGroup className="mb-3">
//             <CInputGroupText id="basic-addon-image">Image</CInputGroupText>
//             <CFormSelect 
//               aria-label="Default select example"
//               value={selectedImage}
//               onChange={(e) => setSelectedImage(e.target.value)}
//             >
//               <option value="">Select Default Image</option>
//               {avatars.map((avatar, index) => (
//                 <option key={index} value={avatar.src}>{avatar.label}</option>
//               ))}
//             </CFormSelect>
//           </CInputGroup>

//           {/* Hiển thị preview của ảnh đã chọn */}
//           {selectedImage && (
//             <div className="image-preview">
//               <img src={selectedImage} alt="Selected" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
//             </div>
//           )}

//           <CInputGroup className="mb-3">
//             <CInputGroupText id="basic-addon-email"><CIcon icon={cilEnvelopeClosed} /></CInputGroupText>
//             <CFormInput
//               name="email"
//               placeholder="Email"
//               aria-label="Email"
//               aria-describedby="basic-addon-email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </CInputGroup>

//           {/* Các trường input khác */}
//           {/* ... */}

//         </CForm>
//       </CModalBody>
//       <CModalFooter>
//         <CButton color="secondary" onClick={onCancel}>Cancel</CButton>
//         <CButton color="primary" onClick={handleFormSubmit}>
//           {'Add'}
//         </CButton>
//       </CModalFooter>
//     </CModal>
//   );
// };

// export default AddCusModal;

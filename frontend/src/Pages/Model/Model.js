/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Upload, message, Button, Menu, Input, Dropdown } from "antd";
import { UploadOutlined, DownOutlined } from "@ant-design/icons";

export default function Model() {
  const [selectedFile, setSelectedFile] = useState();
  const [selectedProblemType, setSelectedProblemType] = useState();

  const onClick = ({ key }) => {
    const ptype = ["binary", "multiclass", "regression"];
    setSelectedProblemType(ptype[key]);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="0">Binary classification</Menu.Item>
      <Menu.Item key="1">Multiclass classification</Menu.Item>
      <Menu.Item key="2">Regression</Menu.Item>
    </Menu>
  );

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("File", selectedFile);
    formData.append("problem_type", selectedProblemType);
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <div style={{ width: "50%" }}>
        <h2>Model</h2>
        <p>Upload Processed / Clean Dataset</p>
        <div style={{ marginTop: 20, marginBottom: 20 }}></div>
        <input type="file" name="file" onChange={changeHandler} />
        <div style={{ marginTop: 20, marginBottom: 20 }}></div>
        <Dropdown.Button
          overlay={menu}
          placement="bottomCenter"
          icon={<DownOutlined />}
        >
          Dropdown
        </Dropdown.Button>
        <div style={{ marginTop: 20, marginBottom: 20 }}></div>
        <div>
          <Button onClick={handleSubmission}>Submit</Button>
        </div>
      </div>
    </div>
  );
}

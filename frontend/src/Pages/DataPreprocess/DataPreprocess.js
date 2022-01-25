import React from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './DataPreprocess.css';

export default function DataPreprocess() {
    var df = "Hi";
    const props = {
        name: 'file',
        action: 'http://127.0.0.1:5000/upload',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            console.log(info);
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                console.log(info.file.response.data);
                df = info.file.response.data;
                var ele = document.getElementById("processed_data");
                ele.innerHTML = df;
                setTable();
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                console.log("NOOOOOOOOOOOOOOOOO");
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    };
    const setTable = () =>{
        console.log("HEREEEEEEEEEEEEEEEEE");
        // var tab = document.getElementsByClassName('dataframe')[0];
        // if(tab){
        //     tab.style.width = "100%";
        //     tab.style.textAlign = "center";
        // }
        // var th = document.getElementsByTagName('thead')[0];
        // if(th){
        //     th.style.align = "center";
        // }
        // if(tab){
        //     tab.style.width = "100%";
        //     tab.style.textAlign = "center";
        // }

        // console.log(tab.innerHTML);
        // let tbody = [...document.getElementsByTagName("tr")];
        // console.log(tbody.slice(0, 30));
        // document.getElementsByTagName("tbody").innerHTML = tbody.slice(0,30);
    }
    return (
        <div>
            <h2>Data Preprocessing</h2>
            <p>Upload any dataset</p>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <div id="processed_data" onChange={setTable()} style={{marginTop: "20px"}}></div>
        </div>
    )
}

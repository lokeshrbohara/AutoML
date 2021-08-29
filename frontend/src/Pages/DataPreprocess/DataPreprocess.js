import React from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
    
export default function DataPreprocess() {
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
    return (
        <div>
            <h2>Data Preprocessing</h2>
            <p>Upload any dataset</p>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <div id="processed_data"></div>
        </div>
    )
}

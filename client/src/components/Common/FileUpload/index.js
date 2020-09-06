import React from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const FileUpload = (props) => {
    return (
        <React.Fragment>
            <Dragger listType='picture' action="/api/book/uploadImage" onChange={(image) => props.uploadImageHandler(image)}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag images to this area to upload</p>
                <p className="ant-upload-hint">교재 이미지 파일을 업로드 합니다.</p>
            </Dragger>
        </React.Fragment>
    );
}

export default FileUpload;

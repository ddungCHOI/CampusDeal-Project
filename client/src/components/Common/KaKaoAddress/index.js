import React from 'react';
import DaumPostcode from 'react-daum-postcode';
import { Modal } from 'antd';

const Postcode = () => {
    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        console.log(fullAddress);  // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    }

    return (
        <DaumPostcode onComplete={handleComplete} />
    );
}

const KakaoAddress = (props) => {

    return (
        <React.Fragment>
            <Modal
                title="우편번호 찾기"
                visible={props.Visible}
                centered
                footer={null}
                onCancel={()=>props.setVisible(false)}
            >
                <DaumPostcode autoClose={true} onComplete={data => {
                    props.setPostcode(data.zonecode);
                    props.setRoadAddress(data.roadAddress);
                    props.setVisible(false);
                }} />
            </Modal>
        </React.Fragment>
    );
}

export default KakaoAddress;



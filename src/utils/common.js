// 공통 함수
// 날짜 출력 등에서 0 padding을 사용하기 위해
export function datePadding(n, digits) {
    var zero = '';
    var i = 0;
    var chk = ''+n;
    chk = chk.toString();
  
    if (chk.length < digits) {
      for (i = 0; i < digits - chk.length; i++)
        zero += '0';
    }

    return zero + chk;
}

// 공통 함수
// DynamoDB에는 empty string을 입력 못하기 때문에 적당한 값으로 변경해 주어야 함.
export function convertStringToDynamo(str) {

    if(str === undefined || str === "" || str === null ) {
        str = "*empty*"
    }

    return str;
}
export function convertArrayToDynamo(arr) {
    var str = arr.replace(/\s/gi, "*empty*");     
    return str;
}
export function convertDynamoToString(str) {
    return str.replace("*empty*", "");
}

export function convertDynamoToArrayString(arr) {
    return arr.replace(/[*]empty[*]/gi," ");   
}

// 특정날짜 요일 조회
export function getInputDayWeek(value) {
    
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    
    var today = new Date(value).getDay();
    var todayLabel = week[today];
    
    return todayLabel;
}

// Blob 데이터 변환
export function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
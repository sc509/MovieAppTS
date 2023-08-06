function truncateString(str:string, num:number):string {
    if (str.length <= num) {
        return str;
    }
    const subString = str.substr(0, num);
    const lastSpaceIndex = subString.lastIndexOf(' ');

    if (lastSpaceIndex > 0) {
        return `${subString.substr(0, lastSpaceIndex)}...`;
    }
    return `${subString}...`;
}

export default truncateString;

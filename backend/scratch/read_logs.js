const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'fare.json');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  let resultsArray = data?.responseData?.Response?.Results || data?.Response?.Results || data?.Results;
  const traceId = data?.responseData?.Response?.TraceId || data?.Response?.TraceId || data?.TraceId;
  const tokenId = data?.responseData?.Response?.TokenId || data?.Response?.TokenId || data?.TokenId;
  
  console.log('Original resultsArray[0] is array:', Array.isArray(resultsArray[0]));
  console.log('Original resultsArray[0] type:', typeof resultsArray[0]);
  
  if (resultsArray && resultsArray.length > 0) {
    if (Array.isArray(resultsArray[0])) {
      resultsArray = resultsArray[0];
    } else if (resultsArray[0] && typeof resultsArray[0] === 'object') {
      resultsArray = Object.values(resultsArray[0]);
    }
  }
  
  console.log('Parsed resultsArray length:', resultsArray ? resultsArray.length : 'none');
  if (resultsArray && resultsArray[0]) {
    const f = resultsArray[0];
    const firstSegment = f.Segments?.[0]?.[0];
    console.log('Mapped flight 0 airline:', firstSegment?.Airline?.AirlineName);
    console.log('Mapped flight 0 price:', f.Fare?.OfferedFare || f.Fare?.PublishedFare);
  }
} catch (e) {
  console.error('Error:', e.message);
}

import { useState } from "react";
import "./Display.css";
import "./FileUpload.css";
const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;
    const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1YmYzYmFlYy03YmFlLTQ5YTMtYWMyZC1iYjBiODRhNmM0Y2QiLCJlbWFpbCI6InRzMTIxOTEyMzRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImVhODVjMWFlM2MzNDRlMDMyMTA0Iiwic2NvcGVkS2V5U2VjcmV0IjoiNzFlMzI2NmFlZTQ4YmMxOTVhMzUyNzE4MjllZWU5MWYyNmRjZWZmMmI4ZTZiMWVkZDM1N2JlODhlMGE5YjNkYyIsImV4cCI6MTc1OTg3MzA2M30.5yEEjPWLF9MhFT_griyD4TNEwUNVdRCNt4jLM02VngE', // Replace with your JWT token from Pinata
        }
      };
    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        // console.log("data:");
        // console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
        console.log("data:");
      }
    } catch (e) {
      alert("You don't have access");
      return;
    }
    
    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) 
        {
            try {
                const response = await fetch('https://api.pinata.cloud/data/pinList', options);
                const pinataData = await response.json();
                console.log('Pinata pinned data:', pinataData);
            
                // Process the data as required, e.g., to display files
                const images = pinataData.rows.map((item, i) => {
                  return (
                    <a href={`https://cyan-objective-porpoise-863.mypinata.cloud/ipfs/${item.ipfs_pin_hash}`} key={i} target="_blank" rel="noopener noreferrer">
                      <img
                        key={i}
                        src={`https://cyan-objective-porpoise-863.mypinata.cloud/ipfs/${item.ipfs_pin_hash}`}
                        alt={`File ${i}`}
                        className="image-list"
                      ></img>
                    </a>
                  );
                });
            
                setData(images);
              } catch (err) {
                console.error('Error fetching data from Pinata:', err);
              }
    //   const str = dataArray.toString();
    //   const str_array = str.split(",");
    //   console.log(str);
    //   console.log(str_array);
    //   const images = str_array.map((item, i) => {
    //     return (
    //       <a href={`https://gateway.pinata.cloud/ipfs/${item}`} key={i} target="_blank" rel="noopener noreferrer">
    //         <img
    //           key={i}
    //           src={`https://gateway.pinata.cloud/ipfs/${item}`}
    //         //   src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
    //           alt="new"
    //           className="image-list"
    //         ></img>
    //       </a>
    //     );
    //   });
    //   setData(images);
    } else {
      alert("No image to display");
    }
  };
  return (
    <>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <button className="center button button-64" onClick={getdata}>
      <span>Get Data</span>
      </button>
    </>
  );
};
export default Display;
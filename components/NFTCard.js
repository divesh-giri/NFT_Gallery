import { useState } from "react";

const NFTCard = ({ nft }) => {
  const [clickedCopy, setClickedCopy] = useState(false);
  const toggleClickedCopy = () => {
    setTimeout(() => {
      setClickedCopy(false);
    }, 500);
  };
  return (
    <div className="w-1/4 flex flex-col ">
      <div className="rounded-md">
        <img
          className="object-cover h-128 w-full rounded-t-md"
          src={nft.media[0].gateway}
        ></img>
      </div>
      <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110">
        <h2 className="text-xl text-gray-800">{nft.title}</h2>
        <p className="text-gray-600">Id: {nft.id.tokenId.substr(-5)}</p>
        <div className="flex gap-2">
          <p className="text-gray-600">{`${nft.contract.address.substr(
            0,
            5
          )}...${nft.contract.address.substr(-5)}`}</p>

          <svg
            onClick={() => {
              setClickedCopy(true);
              return navigator.clipboard.writeText(nft.contract.address);
            }}
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 9a7 7 0 0 1 7-7h8a1 1 0 1 1 0 2H9a5 5 0 0 0-5 5v8a1 1 0 1 1-2 0V9z"
              fill="#000"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 11a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-6zm5-3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3h-6z"
              fill="#000"
            />
          </svg>
          {clickedCopy && (
            <>
              <p>Copied</p>
              {toggleClickedCopy()}
            </>
          )}
        </div>
        <div className="flex-grow mt-2">
          <p className="text-gray-600">{nft.description}</p>
        </div>
        <a
          target={"_blank"}
          href={`https://etherscan.io/address/${nft.contract.address}`}
          className="text-white bg-blue-600 mt-3 rounded-sm w-5/5 text-center"
        >
          View On Etherscan
        </a>
      </div>
    </div>
  );
};

export default NFTCard;

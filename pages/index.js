import { useState } from "react";
import NFTCard from "../components/NFTCard";
const Home = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [collectionAddress, setCollectionAddress] = useState();
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const NFTS_SHOWN_PER_PAGE = 90;

  const walletAddressChangeHandler = (event) => {
    setWalletAddress(event.target.value);
  };

  const collectionAddressChangeHandler = (event) => {
    setCollectionAddress(event.target.value);
  };

  const fetchNFTs = async () => {
    try {
      console.log("Fetching NFTs.......");
      const apiKey = "B2YyMrsslhv3VbhFFuMDIci8qstooyPG";
      let nfts;
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${apiKey}/getNFTs/`;

      if (collectionAddress) {
        console.log("Fetching NFTs for collection owned by address");
        const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;
        const res = await fetch(fetchURL, {
          method: "GET",
        });
        if (!res.ok)
          throw new Error("Something went wrong, during fetch data.");
        nfts = await res.json();
      } else {
        const fetchURL = `${baseURL}?owner=${walletAddress}`;
        const res = await fetch(fetchURL, {
          method: "GET",
        });
        if (!res.ok)
          throw new Error("Something went wrong, during fetch data.");
        nfts = await res.json();
      }
      console.log(nfts);
      setNFTs(nfts.ownedNfts);
      setTotalPages(Math.ceil(nfts.ownedNfts.length / NFTS_SHOWN_PER_PAGE));
    } catch (error) {
      console.log(error.message);
    }
  };

  const getNFTsForCollectionAll = async (startToken = "") => {
    const api_key = "B2YyMrsslhv3VbhFFuMDIci8qstooyPG";
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
    const fetchUrl = `${baseURL}/?contractAddress=${collectionAddress}&startToken=${startToken}&withMetadata=${"true"}`;
    const res = await fetch(fetchUrl, {
      method: "GET",
    });
    const data = await res.json();
    return data;
  };

  const fetchNFTsForCollection = async () => {
    let totalNfts = [];
    let hasNextPage = true;
    let startToken = "";
    console.log("fetching...");
    while (hasNextPage) {
      const { nextToken, nfts } = await getNFTsForCollectionAll(startToken);
      if (!nextToken) {
        hasNextPage = false;
      }
      startToken = nextToken;
      totalNfts = [...totalNfts, ...nfts];
    }
    console.log(totalNfts);
    if (totalNfts.length > 0) {
      console.log("NFTs in collection:", totalNfts);
      setTotalPages(Math.ceil(totalNfts.length / NFTS_SHOWN_PER_PAGE));
      setNFTs(totalNfts);
    }
  };

  const onClickHandler = () => {
    if (fetchForCollection) fetchNFTsForCollection();
    else fetchNFTs();
  };

  const OnPageClick = () => {
    return NFTs.slice(
      (currentPage - 1) * NFTS_SHOWN_PER_PAGE,
      currentPage * NFTS_SHOWN_PER_PAGE
    ).map((nft, indx) => {
      return <NFTCard key={indx} nft={nft}></NFTCard>;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          onChange={walletAddressChangeHandler}
          type={"text"}
          placeholder="Add your wallet address"
          className="w-64 text-center border-2"
        ></input>
        <input
          onChange={collectionAddressChangeHandler}
          type={"text"}
          placeholder="Add the collection address"
          className="w-64 text-center border-2"
        ></input>
        <label className="text-gray-600 ">
          <input
            onChange={(event) => {
              setFetchForCollection(event.target.checked);
            }}
            type={"checkbox"}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <button
          onClick={onClickHandler}
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          }
        >
          Let's go!{" "}
        </button>
      </div>
      {NFTs.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
            <OnPageClick />
          </div>
          <nav aria-label="Page navigation example">
            <ul className="inline-flex items-center -space-x-px">
              {totalPages > 1 && currentPage != 1 && (
                <li
                  onClick={() => setCurrentPage((prev_state) => prev_state - 1)}
                >
                  <a
                    href="#"
                    className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColr"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </li>
              )}
              {[...Array(totalPages)].map((_, indx) => {
                return (
                  <li onClick={() => setCurrentPage(indx + 1)} key={indx}>
                    <a
                      href="#"
                      className={`${
                        indx + 1 === currentPage
                          ? "z-10 py-2 px-3 leading-tight text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                          : "py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      }`}
                    >
                      {indx + 1}
                    </a>
                  </li>
                );
              })}
              {totalPages > 1 && currentPage != totalPages && (
                <li
                  onClick={() => setCurrentPage((prev_state) => prev_state + 1)}
                >
                  <a
                    href="#"
                    className="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </>
      ) : (
        <p>Search for NFTs</p>
      )}
    </div>
  );
};

export default Home;

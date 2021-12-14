import React, { useState, useMemo } from "react";
import { Address } from "../../components";
import { activeColor, bgColor, mainWidth } from "../../theme";
import StackGrid from "react-stack-grid";
import { SearchQuery } from "./SearchQuery"
import { NoData } from "../../components/NoData";
import { Image } from "antd";
import errorImage from "./errorImge.jpg"
import { LoadingCore } from "../../components/Loading"

export const Transfer = (props) => {
  const { mainnetProvider, transferEvents, loadedAssets, blockExplorer, nftAddress } = props
  const blockExplorerLink = (contract, id) => `${blockExplorer || "https://etherscan.io/"}token/${contract}?a=${id}`;
  const assets = useMemo(() => {
    if (!(Array.isArray(loadedAssets) && loadedAssets?.length)) return null
    const asset = {};
    for (let i = 0; i < loadedAssets?.length; i++) {
      asset[parseInt(loadedAssets[i].id)] = loadedAssets[i]
    }
    return asset
  }, [loadedAssets?.length])

  const [data, setData] = useState(transferEvents)

  return (
    <div style={{ width: mainWidth, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "auto", width: 1060, textAlign: "left" }}>
        {data?.length > 0 ? <div> 共{data?.length}条记录</div> : <div style={{ color: "transparent" }}> 共{data?.length}条记录</div>}
        {transferEvents?.length > 0 && <SearchQuery list={transferEvents} setData={setData} assets={assets} />}
      </div>
      {transferEvents?.length > 0 ? <StackGrid columnWidth={250} gutterWidth={20} gutterHeight={32} style={{ marginTop: 20 }}>
        {data?.map(item => {
          return (
            <div
              key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item[2].toNumber()}
              className="cardBox"
              style={{
                background: bgColor,
                boxShadow: "10px 10px 10px rgba(0,0,0,0.5)",
                width: 250,
                height: 275,
                minHeight: 275,
                borderRadius: 5,
                border: `1px solid ${bgColor}`,
                textAlign: "left",
                color: "rgba(0,0,0,0.7)"
              }}>
              <Image
                width={250}
                height={186}
                key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item[2].toNumber()}
                preview={{ mask: null }}
                src={assets ? assets[parseInt(item.tokenId["_hex"])]?.image : errorImage}
                placeholder={
                  <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#F2F2F2"
                  }}>
                    <div style={{ marginLeft: -20, marginTop: -60 }}>
                      <LoadingCore scale={2} />
                    </div>
                  </div>
                }
              />
              <a
                style={{
                  fontSize: 20,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  width: 40,
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: -20,
                  marginLeft: 105,
                  cursor: "pointer",
                  fontStyle: "italic",
                  color: "rgba(0,0,0,0.7)",
                  zIndex: 100
                }}
                target="_blank"
                href={blockExplorerLink(nftAddress, item[2].toNumber())}
              >{item[2].toNumber()}</a>
              <div style={{
                paddingLeft: 10,
                marginTop: 10
              }}>
                {assets && assets[parseInt(item.tokenId["_hex"])]?.description && <span style={{ fontSize: 16, marginRight: 8 }}>{assets[parseInt(item.tokenId["_hex"])]?.description}</span>}
                <div style={{ color: activeColor }}>
                  <Address address={item[0]} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14} size={5} disableBlockies disableCopy />&nbsp;&nbsp;{"=>"}&nbsp;&nbsp;
                  <Address address={item[1]} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14} size={5} disableBlockies disableCopy />
                </div>
              </div>
            </div>
          );
        })}
      </StackGrid> : <NoData style={{ marginTop: 28 }} />}
    </div>
  )
}

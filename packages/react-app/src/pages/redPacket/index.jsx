import React, { useState, useCallback, useEffect, useMemo } from "react";
import { mainWidth } from "../../theme";
import StackGrid from "react-stack-grid";
import { ethers } from "ethers";
import { keyBy, isEmpty, cloneDeep, map, find } from "lodash"
import { NETWORKS } from "../../constants";
import { useLoading } from "../../components/Loading";
import { RedPacketItem } from "./RedPacketItem"

export const RedPacket = props => {
  const {
    writeContracts,
    address,
    tx,
    selectedChainId,
    mainnetProvider
  } = props;
  const { closeLoading } = useLoading();

  const blockExplorer = useMemo(() => {
    return find(NETWORKS, item => String(item?.chainId) == String(selectedChainId))?.blockExplorer || ""
  }, [NETWORKS, selectedChainId])

  const tokenBalance = (token_address) => `${blockExplorer || "https://etherscan.io/"}${"token/"}${token_address}?a=${address}`;

  const [redPacketObj, setRedPacketObj] = useState({})
  const [redPacketList, setRedPacketList] = useState([])

  useEffect(() => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://81.69.8.95/WaterMarginJson/redpacket.json", true);
      xhr.send();
      xhr.onload = function () {
        if (this.status === 200) {
          const response = JSON.parse(this.response);
          /* const response = [
            {
              expireTime: new Date().valueOf() / 1000 + 10,
              id: "0x98dfac8d1641c8aa56d1345f55023bda93a5255ffe6391bc0d9e0ddca3971471",
              name: "庆元旦，迎新春1发大水发大水发大水范德萨防风固沙过分很过分的观后感发大水",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53",
                "0x67Dcc2c5C25DD77983E0CA3dfd1aa33d1D8C0E43",
                "0xf9e9476f7148adCCF577CdDCd2052EC2797757C4",
                "0xfc2168D69BA0f2AE4E2B55FFDd7735Cdf3c9ccb6",
                "0xE0c2bbdC9B1fd0a2c35854f0aCec8AB5c8BFFbBA",
                "0x5DbeffE206A0623A3211e86b891BFA5f1CeDb47e"
              ]
            },
            {
              expireTime: new Date().valueOf() / 1000 + 20,
              id: "0x351365b0cbcba278c08ce45d83585602abb7bac2c4e12098a16d5b022de85924",
              name: "庆元旦，迎新春2",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53",
                "0x67Dcc2c5C25DD77983E0CA3dfd1aa33d1D8C0E43",
                "0xf9e9476f7148adCCF577CdDCd2052EC2797757C4",
                "0xfc2168D69BA0f2AE4E2B55FFDd7735Cdf3c9ccb6",
                "0xE0c2bbdC9B1fd0a2c35854f0aCec8AB5c8BFFbBA",
                "0x5DbeffE206A0623A3211e86b891BFA5f1CeDb47e"
              ]
            },
            {
              expireTime: new Date().valueOf() / 1000 + 40,
              id: "0x49d4d94781709d909f74fc44898ac3f9397141ffb0a51240a4f8189bc1a75863",
              name: "庆元旦，迎新春2",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53",
                "0x67Dcc2c5C25DD77983E0CA3dfd1aa33d1D8C0E43",
                "0xf9e9476f7148adCCF577CdDCd2052EC2797757C4",
                "0xfc2168D69BA0f2AE4E2B55FFDd7735Cdf3c9ccb6",
                "0xE0c2bbdC9B1fd0a2c35854f0aCec8AB5c8BFFbBA",
                "0x5DbeffE206A0623A3211e86b891BFA5f1CeDb47e"
              ]
            },
            {
              expireTime: 1655426061,
              id: "0x49d4d94781709d909f74fc44898ac3f9397141ffb0a51240a4f8189bc1a75864",
              name: "庆元旦，迎新春2",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53",
                "0x67Dcc2c5C25DD77983E0CA3dfd1aa33d1D8C0E43",
                "0xf9e9476f7148adCCF577CdDCd2052EC2797757C4",
                "0xfc2168D69BA0f2AE4E2B55FFDd7735Cdf3c9ccb6",
                "0xE0c2bbdC9B1fd0a2c35854f0aCec8AB5c8BFFbBA",
                "0x5DbeffE206A0623A3211e86b891BFA5f1CeDb47e"
              ]
            },
            {
              expireTime: 1655426061,
              id: "0x49d4d94781709d909f74fc44898ac3f9397141ffb0a51240a4f8189bc1a75862",
              name: "庆元旦，迎新春2",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53",
                "0x67Dcc2c5C25DD77983E0CA3dfd1aa33d1D8C0E43",
                "0xf9e9476f7148adCCF577CdDCd2052EC2797757C4",
                "0xfc2168D69BA0f2AE4E2B55FFDd7735Cdf3c9ccb6",
                "0xE0c2bbdC9B1fd0a2c35854f0aCec8AB5c8BFFbBA",
                "0x5DbeffE206A0623A3211e86b891BFA5f1CeDb47e"
              ]
            },
            {
              expireTime: 1655426061,
              id: "0x49d4d94781709d909f74fc44898ac3f9397141ffb0a51240a4f8189bc1a75861",
              name: "庆元旦，迎新春2",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53",
                "0x67Dcc2c5C25DD77983E0CA3dfd1aa33d1D8C0E43",
                "0xf9e9476f7148adCCF577CdDCd2052EC2797757C4",
                "0xfc2168D69BA0f2AE4E2B55FFDd7735Cdf3c9ccb6",
                "0xE0c2bbdC9B1fd0a2c35854f0aCec8AB5c8BFFbBA",
                "0x5DbeffE206A0623A3211e86b891BFA5f1CeDb47e"
              ]
            }
          ] */
          setRedPacketObj(keyBy(response, "id"))
          setRedPacketList(response)
        }
      };
    } catch (error) {
      console.log(error);
    }
  }, [])

  const getClaimBalances = useCallback(async (id, addressList = []) => {
    try {
      const balances = await writeContracts?.HappyRedPacket.check_availability(id)
      closeLoading()
      const claimed = Number(ethers?.utils?.formatUnits(balances?.claimed_amount, 0)) !== 0
      const isInList = addressList?.indexOf(address) >= 0
      setRedPacketObj((pre) => {
        const obj = cloneDeep(pre);
        obj[id] = {
          ...obj[id],
          claimed: claimed,
          claimed_amount: balances?.claimed_amount,
          expired: balances?.expired,
          token_address: balances?.token_address,
          disable: claimed || !isInList || balances?.expired,
          isInList,
          isLoadingComplete: true
        }
        return obj
      })
    } catch (error) {
      console.log(error)
      console.log("一般都是网络错误导致合约调用错误造成的")
      closeLoading()
      setRedPacketObj((pre) => {
        const obj = cloneDeep(pre);
        obj[id].isLoadingComplete = true
        obj[id].isInList = false
        obj[id].disable = true
        return obj
      })
    }
  }, [writeContracts?.HappyRedPacket, address, selectedChainId])

  useEffect(() => {
    // 从区块链获取合约红包的数据
    if (isEmpty(redPacketList) || !writeContracts?.HappyRedPacket || !writeContracts?.HappyRedPacket?.signer || address === "0x4533cC1B03AC05651C3a3d91d8538B7D3E66cbf0" || !address || !selectedChainId) return
    for (let i = 0; i < redPacketList?.length; i++) {
      getClaimBalances(redPacketList[i]?.id, redPacketList[i]?.address)
    }
  }, [redPacketList, writeContracts?.HappyRedPacket, address, selectedChainId])

  return (
    <div style={{ width: "100%", paddingTop: 50, paddingBottom: 50 }}>
      <div style={{ width: mainWidth, margin: "auto", position: "relative" }}>
        <StackGrid columnWidth={250} gutterWidth={20} gutterHeight={32} style={{ marginTop: 20 }}>
          {map(redPacketObj, (item) => {
            return (
              <RedPacketItem
                key={`${item?.id}`}
                writeContracts={writeContracts}
                address={address}
                item={item}
                tx={tx}
                selectedChainId={selectedChainId}
                redPacketList={redPacketList}
                setRedPacketObj={setRedPacketObj}
                tokenBalance={tokenBalance}
                mainnetProvider={mainnetProvider}
                getClaimBalances={getClaimBalances}
              />
            );
          })}
        </StackGrid>
      </div>
    </div>
  );
};

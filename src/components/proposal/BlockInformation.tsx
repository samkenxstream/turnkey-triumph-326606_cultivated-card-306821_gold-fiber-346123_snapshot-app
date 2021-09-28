import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import i18n from "i18n-js";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { getUrl } from "@snapshot-labs/snapshot.js/src/utils";
import colors from "../../constants/colors";
import { Proposal } from "../../types/proposal";
import { shorten, dateFormat, n, explorerUrl } from "../../util/miscUtils";
import Block from "../Block";
import { Space } from "../../types/explore";
import Token from "../Token";

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  row: {
    flexDirection: "row",
    lineHeight: 24,
    marginBottom: 4,
  },
  rowTitle: {
    fontSize: 18,
    color: colors.darkGray,
    fontFamily: "Calibre-Semibold",
  },
  rowValue: {
    marginLeft: "auto",
  },
  rowValueText: {
    fontSize: 18,
    fontFamily: "Calibre-Medium",
    color: colors.darkGray,
  },
});

function getVotingType(type: string) {
  switch (type) {
    case "single-choice":
      return "singleChoiceVoting";
    case "approval":
      return "approvalVoting";
    case "quadratic":
      return "quadraticVoting";
    case "ranked-choice":
      return "rankedChoiceVoting";
    case "weighted":
      return "weightedVoting";
  }
  return "";
}

type BlockInformationProps = {
  proposal: Proposal;
  space: Space | {};
};

function BlockInformation({ proposal, space }: BlockInformationProps) {
  const author = useMemo(() => shorten(proposal.author), [proposal]);
  const proposalStart = useMemo(() => dateFormat(proposal.start), [proposal]);
  const proposalEnd = useMemo(() => dateFormat(proposal.end), [proposal]);
  const votingType = useMemo(() => getVotingType(proposal.type), [proposal]);
  const strategies = useMemo(
    () => proposal.strategies ?? space.strategies ?? [],
    [proposal, space]
  );
  const symbols = useMemo(
    () => strategies.map((strategy) => strategy.params.symbol),
    [proposal, space]
  );

  return (
    <Block
      title={i18n.t("information")}
      Content={
        <View style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{i18n.t("strategies")}</Text>
            <View style={[styles.rowValue, { height: 20 }]}>
              {symbols.map((symbol: string, symbolIndex: number) => (
                <Token symbolIndex={symbolIndex} size={20} space={space} />
              ))}
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{i18n.t("author")}</Text>
            <View style={styles.rowValue}>
              <Text style={styles.rowValueText}>{author}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{i18n.t("ipfs")}</Text>
            <View style={styles.rowValue}>
              <TouchableOpacity
                onPress={() => {
                  const url = getUrl(proposal.id);
                  Linking.openURL(url);
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.rowValueText}>
                    #{proposal.id.slice(0, 7)}
                  </Text>
                  <FontAwesome5Icon
                    name="external-link-alt"
                    style={{ marginLeft: 8 }}
                    size={12}
                    color={colors.darkGray}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{i18n.t("votingSystem")}</Text>
            <View style={styles.rowValue}>
              <Text style={styles.rowValueText}>
                {votingType === "" ? "" : i18n.t(votingType)}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{i18n.t("start")}</Text>
            <View style={styles.rowValue}>
              <Text style={styles.rowValueText}>{proposalStart}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{i18n.t("end")}</Text>
            <View style={styles.rowValue}>
              <Text style={styles.rowValueText}>{proposalEnd}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{i18n.t("snapshot")}</Text>
            <View style={styles.rowValue}>
              <TouchableOpacity
                onPress={() => {
                  const url = explorerUrl(
                    space.network,
                    proposal.snapshot,
                    "block"
                  );
                  Linking.openURL(url);
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.rowValueText}>
                    {n(proposal.snapshot, "0,0")}
                  </Text>
                  <FontAwesome5Icon
                    name="external-link-alt"
                    style={{ marginLeft: 8 }}
                    size={12}
                    color={colors.darkGray}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      }
    />
  );
}

export default BlockInformation;
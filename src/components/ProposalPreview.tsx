import React, { useMemo } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
import { Proposal } from "../types/proposal";
import { getUrl } from "@snapshot-labs/snapshot.js/src/utils";
import { getTimeAgo, shorten } from "../util/miscUtils";
import StateBadge from "./StateBadge";
import { useNavigation } from "@react-navigation/native";
import { PROPOSAL_SCREEN } from "../constants/navigation";
import removeMd from "remove-markdown";
import i18n from "i18n-js";
import get = Reflect.get;
import { Space } from "../types/explore";

const styles = StyleSheet.create({
  proposalPreviewContainer: {
    borderColor: colors.borderColor,
    borderBottomWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  headerAuthor: {
    color: colors.darkGray,
    fontSize: 18,
    marginLeft: 8,
    fontFamily: "Calibre-Medium",
    lineHeight: 28,
    marginRight: 10,
  },
  statusContainer: {
    marginLeft: "auto",
  },
  title: {
    color: colors.headingColor,
    fontFamily: "Calibre-Semibold",
    fontSize: 24,
  },
  body: {
    color: colors.darkGray,
    fontFamily: "Calibre-Medium",
    fontSize: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  period: {
    fontSize: 18,
    color: colors.darkGray,
    fontFamily: "Calibre-Medium",
  },
});

function getPeriod(state: string, start: number, end: number) {
  if (state === "closed") {
    return i18n.t("endedAgo", { timeAgo: getTimeAgo(end) });
  } else if (state === "active") {
    return i18n.t("endIn", { timeAgo: getTimeAgo(end) });
  }
  return i18n.t("startIn", { timeAgo: getTimeAgo(start) });
}

type ProposalPreviewProps = {
  proposal: Proposal;
};

function ProposalPreview({ proposal }: ProposalPreviewProps) {
  const navigation: any = useNavigation();
  const formattedBody = useMemo(
    () =>
      shorten(removeMd(proposal.body), 140).replace(
        /(\S+)\n\s*(\S+)/g,
        "$1 $2"
      ),
    [proposal]
  );
  const avatarUrl = useMemo(() => getUrl(proposal.space.avatar), [proposal]);
  const title = useMemo(() => shorten(proposal.title, 124), [proposal]);
  const period = useMemo(
    () => getPeriod(proposal.state, proposal.start, proposal.end),
    [proposal]
  );

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(PROPOSAL_SCREEN, { proposal });
      }}
    >
      <View style={styles.proposalPreviewContainer}>
        <View style={styles.header}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={styles.headerAuthor}>
            {proposal.space.name} by {shorten(proposal.author)}
          </Text>
          <View style={styles.statusContainer}>
            <StateBadge state={proposal.state} />
          </View>
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{formattedBody}</Text>
          <Text style={styles.period}>{period}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ProposalPreview;
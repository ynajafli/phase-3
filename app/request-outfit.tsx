import { auth } from "@/firebaase/config";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Outfit = {
    id: number;
    name: string;
    mainImage: any;   // image for the card
    topImage: any;    // top piece in the modal
    bottomImage: any; // bottom piece in the modal
    explanation: string; // "Why this outfit works"
};

const ALL_OUTFITS: Outfit[] = [
    {
        id: 1,
        name: "Outfit #1",
        mainImage: require("../assets/images/outfit1.png"),
        topImage: require("../assets/images/top1.png"),
        bottomImage: require("../assets/images/bottom1.png"),
        explanation:
            "The black skirt grounds the look, while the striped top adds contrast without overwhelming the silhouette. The outfit balances structure and pattern, creating a modern casual style suitable for outings or daily wear.",
    },
    {
        id: 2,
        name: "Outfit #2",
        mainImage: require("../assets/images/outfit2.png"),
        topImage: require("../assets/images/top1.png"),
        bottomImage: require("../assets/images/bottom1.png"),
        explanation:
            "Soft white on top keeps the look light, while denim on the bottom adds structure and everyday versatility.",
    },
    {
        id: 3,
        name: "Outfit #3",
        mainImage: require("../assets/images/outfit3.png"),
        topImage: require("../assets/images/top1.png"),
        bottomImage: require("../assets/images/bottom1.png"),
        explanation:
            "Blue and white create a clean, fresh palette that looks polished but still relaxed.",
    },
    {
        id: 4,
        name: "Outfit #4",
        mainImage: require("../assets/images/outfit4.png"),
        topImage: require("../assets/images/top1.png"),
        bottomImage: require("../assets/images/bottom1.png"),
        explanation:
            "Warm neutrals make this outfit easy to pair with accessories and perfect for everyday wear.",
    },
    {
        id: 5,
        name: "Outfit #5",
        mainImage: require("../assets/images/outfit4.png"),
        topImage: require("../assets/images/top1.png"),
        bottomImage: require("../assets/images/bottom1.png"),
        explanation:
            "The graphic tee adds personality, while high-waisted jeans keep the silhouette flattering and casual.",
    },
    {
        id: 6,
        name: "Outfit #6",
        mainImage: require("../assets/images/outfit3.png"),
        topImage: require("../assets/images/top1.png"),
        bottomImage: require("../assets/images/bottom1.png"),
        explanation:
            "A structured blazer balances the softness of the pleated skirt for a smart-casual look.",
    },
    {
        id: 7,
        name: "Outfit #7",
        mainImage: require("../assets/images/outfit2.png"),
        topImage: require("../assets/images/top1.png"),
        bottomImage: require("../assets/images/bottom1.png"),
        explanation:
            "Vertical stripes elongate the torso, while black pants keep the outfit sharp and easy to style.",
    },
    {
        id: 8,
        name: "Outfit #8",
        mainImage: require("../assets/images/outfit1.png"),
        topImage: require("../assets/images/top1.png"),
        bottomImage: require("../assets/images/bottom1.png"),
        explanation:
            "Crisp white with navy feels classic and tailored, ideal for days when you want to look put-together.",
    },
];

const VISIBLE_COUNT = 4;

export default function OutfitGenerator() {
    const [startIndex, setStartIndex] = useState(0);
    const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);

    const router = useRouter();

    async function handleSignOut() {
        try {
            await signOut(auth);
            router.replace("/");   // back to Login Page
        } catch (e) {
            console.log("SIGN OUT ERROR:", e);
        }
    }

    const getVisibleOutfits = () => {
        const result: Outfit[] = [];
        for (let i = 0; i < VISIBLE_COUNT; i++) {
            const idx = (startIndex + i) % ALL_OUTFITS.length;
            result.push(ALL_OUTFITS[idx]);
        }
        return result;
    };

    const visibleOutfits = getVisibleOutfits();

    const handleGenerateMore = () => {
        setStartIndex((prev) => (prev + VISIBLE_COUNT) % ALL_OUTFITS.length);
    };

    const handleRefresh = () => {
        handleGenerateMore();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>AI Style Companion</Text>
                <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                    <Text style={styles.refreshIcon}>⟳</Text>
                </TouchableOpacity>
            </View>

            {/* AI Outfit Suggestions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>AI Outfit Suggestions</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.outfitScroll}
                >
                    {visibleOutfits.map((outfit) => (
                        <TouchableOpacity
                            key={outfit.id}
                            style={styles.outfitCard}
                            activeOpacity={0.8}
                            onPress={() => setSelectedOutfit(outfit)}
                        >
                            <Image
                                source={outfit.mainImage}
                                style={styles.outfitImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.outfitName}>{outfit.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={styles.generateButton}
                    onPress={handleGenerateMore}
                >
                    <Text style={styles.generateButtonText}>Generate More Outfits</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for selected outfit */}
            <Modal
                visible={!!selectedOutfit}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedOutfit(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        {/* Modal header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedOutfit ? `${selectedOutfit.name} Suggestion` : ""}
                            </Text>
                            <TouchableOpacity onPress={() => setSelectedOutfit(null)}>
                                <Text style={styles.modalClose}>×</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedOutfit && (
                            <>
                                {/* Top image */}
                                <Image
                                    source={selectedOutfit.topImage }
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.modalLabel}>Top</Text>

                                {/* Bottom image */}
                                <Image
                                    source={selectedOutfit.bottomImage}
                                    style={styles.modalImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.modalLabel}>Bottom</Text>

                                {/* Explanation box */}
                                <View style={styles.explanationBox}>
                                    <Text style={styles.explanationTitle}>
                                        Why This Outfit Works
                                    </Text>
                                    <Text style={styles.explanationText}>
                                        {selectedOutfit.explanation}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#9E9E9E",
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: "Playfair Display",
        fontWeight: "700",
        lineHeight: 40,
        color: "#8C1C13",
    },
    refreshButton: {
        padding: 6,
        borderRadius: 20,
    },
    refreshIcon: {
        fontSize: 18,
        fontFamily: "Montserrat",
        fontWeight: "400",
        lineHeight: 24,
        color: "#8C1C13",
    },
    section: {
        marginTop: 16,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: "Playfair Display",
        fontWeight: "700",
        lineHeight: 32,
        color: "#8C1C13",
        marginBottom: 12,
    },
    outfitScroll: {
        paddingVertical: 8,
    },
    outfitCard: {
        width: 180,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 12,
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        alignItems: "center",
    },
    outfitImage: {
        width: "100%",
        height: 140,
        borderRadius: 12,
        marginBottom: 10,
    },
    outfitName: {
        fontSize: 16,
        fontFamily: "Montserrat",
        fontWeight: "500",
        lineHeight: 24,
        color: "#8C1C13",
    },
    generateButton: {
        marginTop: 20,
        alignSelf: "center",
        backgroundColor: "#8C1C13",
        borderRadius: 20,
        paddingHorizontal: 28,
        paddingVertical: 12,
    },
    generateButtonText: {
        fontSize: 16,
        fontFamily: "Montserrat",
        fontWeight: "500",
        lineHeight: 24,
        color: "#FFFFFF",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalCard: {
        width: "85%",
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: "Playfair Display",
        fontWeight: "700",
        lineHeight: 28,
        color: "#8C1C13",
    },
    modalClose: {
        fontSize: 24,
        fontFamily: "Montserrat",
        fontWeight: "400",
        lineHeight: 28,
        color: "#8C1C13",
    },
    modalImage: {
        width: "80%",
        height: 140,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 6,
    },
    modalLabel: {
        textAlign: "center",
        fontSize: 14,
        fontFamily: "Montserrat",
        fontWeight: "600",
        lineHeight: 20,
        marginBottom: 4,
        color: "#8C1C13",
    },
    explanationBox: {
        marginTop: 14,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#D4A574",
    },
    explanationTitle: {
        fontSize: 20,
        fontFamily: "Playfair Display",
        fontWeight: "700",
        lineHeight: 28,
        marginBottom: 6,
        color: "#8C1C13",
        textAlign: "center",
    },
    explanationText: {
        fontSize: 14,
        fontFamily: "Montserrat",
        fontWeight: "400",
        lineHeight: 20,
        color: "#424242",
    },
    signOutButton: {
        marginTop: 30,
        marginBottom: 40,
        alignSelf: "center",
        backgroundColor: "#C62828",
        paddingVertical: 10,
        paddingHorizontal: 22,
        borderRadius: 12,
    },
    signOutText: {
        fontSize: 16,
        fontFamily: "Montserrat",
        fontWeight: "500",
        lineHeight: 24,
        color: "#FFFFFF",
    },
});

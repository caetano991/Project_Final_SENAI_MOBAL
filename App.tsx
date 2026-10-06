import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

type Screen = "welcome" | "login" | "signup" | "home" | "library" | "player";
type Tab = "home" | "library";

type Song = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  colors: [string, string];
};

const COLORS = {
  ink: "#171717",
  muted: "#a3a3a3",
  faint: "#d4d4d4",
  line: "#eeeeee",
  surface: "#f5f5f5",
  white: "#ffffff",
  rose: "#f43f5e",
  error: "#fca5a5",
};

const stagePhoto = {
  uri: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=88&w=1080",
};

const songs: Song[] = [
  { id: 1, title: "Lavender Haze", artist: "Taylor Swift", album: "Midnights", duration: 202, colors: ["#b89ce8", "#4f3f78"] },
  { id: 2, title: "Midnight Rain", artist: "Taylor Swift", album: "Midnights", duration: 174, colors: ["#7696d2", "#283c67"] },
  { id: 3, title: "Anti-Hero", artist: "Taylor Swift", album: "Midnights", duration: 200, colors: ["#6eafc2", "#204d66"] },
  { id: 4, title: "Snow on the Beach", artist: "Taylor Swift feat. Lana", album: "Midnights", duration: 219, colors: ["#90c8c6", "#3a6671"] },
  { id: 5, title: "Karma", artist: "Taylor Swift", album: "Midnights", duration: 221, colors: ["#d48bc5", "#68405f"] },
  { id: 6, title: "Kill Bill", artist: "SZA", album: "SOS", duration: 153, colors: ["#e89b8b", "#6f3a39"] },
  { id: 7, title: "Flowers", artist: "Miley Cyrus", album: "Endless Summer", duration: 200, colors: ["#e6bd72", "#745630"] },
  { id: 8, title: "As It Was", artist: "Harry Styles", album: "Harry's House", duration: 167, colors: ["#d2819b", "#713a4d"] },
];

const featured = [
  { title: "Midnights", artist: "Taylor Swift", song: songs[0] },
  { title: "SOS", artist: "SZA", song: songs[5] },
  { title: "Endless Summer", artist: "Miley Cyrus", song: songs[6] },
];

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function AlbumArt({ song, style }: { song: Song; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient
      accessibilityLabel={`Capa de ${song.album}`}
      colors={song.colors}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.albumArt, style]}
    >
      <View style={styles.albumRing} />
      <View style={styles.albumGlow} />
      <Text style={styles.albumMark}>MELO</Text>
    </LinearGradient>
  );
}

function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground source={stagePhoto} resizeMode="cover" style={styles.authBackground}>
      <LinearGradient
        colors={["rgba(8,8,8,0.24)", "rgba(8,8,8,0.78)", "rgba(8,8,8,0.98)"]}
        locations={[0, 0.48, 1]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </ImageBackground>
  );
}

function Welcome({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <AuthBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.welcomeContent}>
          <View>
            <Text style={styles.brand}>MELO</Text>
            <Text style={styles.heroTitle}>
              Música para cada{"\n"}
              <Text style={styles.heroAccent}>momento seu.</Text>
            </Text>
            <Text style={styles.heroCopy}>
              Descubra sons, guarde favoritos e leve sua música para onde for.
            </Text>
          </View>
          <View>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigate("signup")}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.primaryButtonText}>Criar uma conta</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => navigate("login")}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            >
              <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
            </Pressable>
            <Text style={styles.photoCredit}>Foto de Nainoa Shizuru no Unsplash</Text>
          </View>
        </View>
      </SafeAreaView>
    </AuthBackground>
  );
}

function validateEmail(value: string) {
  if (!value.trim()) return "Este campo é obrigatório.";
  if (!value.includes("@") || !value.includes(".")) return "Digite um e-mail válido.";
  return "";
}

function validatePassword(value: string) {
  if (!value) return "Este campo é obrigatório.";
  if (value.length < 6) return "Use pelo menos 6 caracteres.";
  return "";
}

function Field({
  label,
  value,
  error,
  secure = false,
  email = false,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  secure?: boolean;
  email?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={email ? "none" : "words"}
        autoComplete={email ? "email" : secure ? "password" : "name"}
        keyboardType={email ? "email-address" : "default"}
        onChangeText={onChange}
        secureTextEntry={secure}
        selectionColor={COLORS.white}
        style={[styles.fieldInput, error ? styles.fieldInputError : null]}
        value={value}
      />
      <Text style={styles.fieldError}>{error || " "}</Text>
    </View>
  );
}

function AuthForm({
  mode,
  navigate,
}: {
  mode: "login" | "signup";
  navigate: (screen: Screen) => void;
}) {
  const signup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: signup && !name.trim() ? "Este campo é obrigatório." : "",
    email: validateEmail(email),
    password: validatePassword(password),
    confirmation: signup
      ? !confirmation
        ? "Este campo é obrigatório."
        : confirmation !== password
          ? "As senhas não coincidem."
          : ""
      : "",
  };

  function submit() {
    setSubmitted(true);
    if (!Object.values(errors).some(Boolean)) navigate("home");
  }

  return (
    <AuthBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.safeArea}
        >
          <ScrollView
            contentContainerStyle={styles.authScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Pressable
                accessibilityLabel="Voltar"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => navigate("welcome")}
                style={styles.authBack}
              >
                <Ionicons color="rgba(255,255,255,0.75)" name="chevron-back" size={21} />
              </Pressable>
              <Text style={styles.authTitle}>
                {signup ? "Crie sua conta" : "Que bom ter você aqui"}
              </Text>
              <Text style={styles.authSubtitle}>
                {signup ? "Leva só um minuto para começar." : "Entre para continuar ouvindo."}
              </Text>
              {signup && (
                <Field
                  error={submitted ? errors.name : ""}
                  label="NOME"
                  onChange={setName}
                  value={name}
                />
              )}
              <Field
                email
                error={submitted ? errors.email : ""}
                label="E-MAIL"
                onChange={setEmail}
                value={email}
              />
              <Field
                error={submitted ? errors.password : ""}
                label="SENHA"
                onChange={setPassword}
                secure
                value={password}
              />
              {signup && (
                <Field
                  error={submitted ? errors.confirmation : ""}
                  label="CONFIRMAR SENHA"
                  onChange={setConfirmation}
                  secure
                  value={confirmation}
                />
              )}
            </View>
            <View style={styles.authActions}>
              <Pressable
                accessibilityRole="button"
                onPress={submit}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
              >
                <Text style={styles.primaryButtonText}>
                  {signup ? "Criar conta" : "Entrar"}
                </Text>
              </Pressable>
              <View style={styles.authSwitchRow}>
                <Text style={styles.authSwitchMuted}>
                  {signup ? "Já tem uma conta? " : "Ainda não tem conta? "}
                </Text>
                <Pressable onPress={() => navigate(signup ? "login" : "signup")}>
                  <Text style={styles.authSwitchLink}>
                    {signup ? "Entrar" : "Cadastre-se"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthBackground>
  );
}

function BottomNav({ active, navigate }: { active: Tab; navigate: (screen: Screen) => void }) {
  const items = [
    { id: "home" as Tab, label: "Início", icon: "home-outline" as const },
    { id: "library" as Tab, label: "Biblioteca", icon: "library-outline" as const },
  ];

  return (
    <SafeAreaView style={styles.navSafeArea}>
      <View style={styles.bottomNav}>
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              key={item.id}
              onPress={() => navigate(item.id)}
              style={styles.navItem}
            >
              <Ionicons
                color={selected ? COLORS.ink : COLORS.faint}
                name={selected ? item.icon.replace("-outline", "") as typeof item.icon : item.icon}
                size={20}
              />
              <Text style={[styles.navLabel, selected && styles.navLabelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

function SectionHeading({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

function SongRow({ song, onPress }: { song: Song; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={`${song.title}, ${song.artist}`}
      onPress={onPress}
      style={({ pressed }) => [styles.songRow, pressed && styles.rowPressed]}
    >
      <AlbumArt song={song} style={styles.songRowArt} />
      <View style={styles.songRowText}>
        <Text numberOfLines={1} style={styles.songRowTitle}>{song.title}</Text>
        <Text numberOfLines={1} style={styles.songRowArtist}>{song.artist}</Text>
      </View>
      <Text style={styles.songDuration}>{formatTime(song.duration)}</Text>
    </Pressable>
  );
}

function Home({ navigate }: { navigate: (screen: Screen, song?: Song) => void }) {
  return (
    <SafeAreaView style={styles.appScreen}>
      <ScrollView
        contentContainerStyle={styles.homeContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.homeHeader}>
          <Text style={styles.eyebrow}>BOA TARDE</Text>
          <View style={styles.homeTitleRow}>
            <Text style={styles.screenTitle}>Rafael</Text>
            <LinearGradient
              colors={["#d9cdc1", "#75695f"]}
              style={styles.avatar}
            />
          </View>
        </View>

        <View style={styles.homeSection}>
          <View style={styles.horizontalSectionHeading}>
            <SectionHeading action="Ver tudo" title="Em destaque" />
          </View>
          <ScrollView
            contentContainerStyle={styles.featuredList}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {featured.map((item) => (
              <Pressable
                key={item.title}
                onPress={() => navigate("player", item.song)}
                style={({ pressed }) => [styles.featuredCard, pressed && styles.cardPressed]}
              >
                <AlbumArt song={item.song} style={styles.featuredArt} />
                <Text numberOfLines={1} style={styles.featuredTitle}>{item.title}</Text>
                <Text numberOfLines={1} style={styles.featuredArtist}>{item.artist}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.contentSection}>
          <SectionHeading title="Tocado recentemente" />
          <View style={styles.recentGrid}>
            {songs.slice(0, 4).map((song) => (
              <Pressable
                key={song.id}
                onPress={() => navigate("player", song)}
                style={({ pressed }) => [styles.recentCard, pressed && styles.cardPressed]}
              >
                <AlbumArt song={song} style={styles.recentArt} />
                <View style={styles.recentText}>
                  <Text numberOfLines={1} style={styles.recentTitle}>{song.title}</Text>
                  <Text numberOfLines={1} style={styles.recentArtist}>{song.artist}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.contentSection}>
          <SectionHeading title="Escolhas para você" />
          {songs.slice(4).map((song) => (
            <SongRow key={song.id} onPress={() => navigate("player", song)} song={song} />
          ))}
        </View>
      </ScrollView>
      <BottomNav active="home" navigate={navigate} />
    </SafeAreaView>
  );
}

function Library({ navigate }: { navigate: (screen: Screen, song?: Song) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return songs.filter((song) =>
      `${song.title} ${song.artist}`.toLocaleLowerCase("pt-BR").includes(normalized),
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.appScreen}>
      <ScrollView
        contentContainerStyle={styles.libraryContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Biblioteca</Text>
        <View style={styles.searchBox}>
          <Ionicons color={COLORS.muted} name="search-outline" size={18} />
          <TextInput
            accessibilityLabel="Buscar música ou artista"
            autoCapitalize="none"
            onChangeText={setQuery}
            placeholder="Música ou artista"
            placeholderTextColor={COLORS.muted}
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />
          {query ? (
            <Pressable accessibilityLabel="Limpar busca" hitSlop={8} onPress={() => setQuery("")}>
              <Ionicons color={COLORS.muted} name="close-circle" size={17} />
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.resultCount}>
          {filtered.length} {filtered.length === 1 ? "MÚSICA" : "MÚSICAS"}
        </Text>
        {filtered.length ? (
          filtered.map((song) => (
            <SongRow key={song.id} onPress={() => navigate("player", song)} song={song} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons color={COLORS.faint} name="search-outline" size={25} />
            </View>
            <Text style={styles.emptyTitle}>Nenhuma música encontrada</Text>
            <Text style={styles.emptyCopy}>Tente buscar por outro título ou artista.</Text>
          </View>
        )}
      </ScrollView>
      <BottomNav active="library" navigate={navigate} />
    </SafeAreaView>
  );
}

function Player({
  initialSong,
  navigate,
}: {
  initialSong: Song;
  navigate: (screen: Screen) => void;
}) {
  const initialIndex = Math.max(0, songs.findIndex((song) => song.id === initialSong.id));
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const song = songs[index];

  useEffect(() => {
    if (interval.current) clearInterval(interval.current);
    if (playing) {
      interval.current = setInterval(() => {
        setProgress((current) => {
          if (current < song.duration) return current + 1;
          setIndex((value) => (value + 1) % songs.length);
          return 0;
        });
      }, 1000);
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [playing, song.duration]);

  function changeSong(direction: number) {
    setIndex((current) => (current + direction + songs.length) % songs.length);
    setProgress(0);
  }

  function toggleLike() {
    setLiked((items) =>
      items.includes(song.id) ? items.filter((id) => id !== song.id) : [...items, song.id],
    );
  }

  const isLiked = liked.includes(song.id);

  return (
    <SafeAreaView style={styles.appScreen}>
      <View style={styles.player}>
        <View style={styles.playerHeader}>
          <Pressable
            accessibilityLabel="Voltar para o início"
            hitSlop={8}
            onPress={() => navigate("home")}
            style={styles.roundButton}
          >
            <Ionicons color="#737373" name="chevron-down" size={21} />
          </Pressable>
          <View style={styles.playerHeading}>
            <Text style={styles.playerEyebrow}>TOCANDO AGORA</Text>
            <Text style={styles.playerAlbum}>{song.album}</Text>
          </View>
          <View style={styles.roundButtonSpacer} />
        </View>

        <AlbumArt song={song} style={styles.playerArt} />

        <View style={styles.playerMeta}>
          <View style={styles.playerMetaText}>
            <Text numberOfLines={1} style={styles.playerTitle}>{song.title}</Text>
            <Text numberOfLines={1} style={styles.playerArtist}>{song.artist}</Text>
          </View>
          <Pressable
            accessibilityLabel={isLiked ? "Remover dos favoritos" : "Curtir música"}
            hitSlop={12}
            onPress={toggleLike}
          >
            <Ionicons
              color={isLiked ? COLORS.rose : COLORS.muted}
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
            />
          </Pressable>
        </View>

        <View style={styles.progressSection}>
          <Slider
            accessibilityLabel="Progresso da música"
            maximumTrackTintColor="#e5e5e5"
            maximumValue={song.duration}
            minimumTrackTintColor={COLORS.ink}
            minimumValue={0}
            onValueChange={setProgress}
            step={1}
            style={styles.slider}
            thumbTintColor={COLORS.ink}
            value={progress}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(progress)}</Text>
            <Text style={styles.timeText}>{formatTime(song.duration)}</Text>
          </View>
        </View>

        <View style={styles.playerControls}>
          <Pressable
            accessibilityLabel="Música anterior"
            hitSlop={12}
            onPress={() => changeSong(-1)}
          >
            <Ionicons color="#404040" name="play-skip-back" size={25} />
          </Pressable>
          <Pressable
            accessibilityLabel={playing ? "Pausar" : "Reproduzir"}
            onPress={() => setPlaying((value) => !value)}
            style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
          >
            <Ionicons
              color={COLORS.white}
              name={playing ? "pause" : "play"}
              size={28}
              style={playing ? undefined : styles.playIcon}
            />
          </Pressable>
          <Pressable
            accessibilityLabel="Próxima música"
            hitSlop={12}
            onPress={() => changeSong(1)}
          >
            <Ionicons color="#404040" name="play-skip-forward" size={25} />
          </Pressable>
        </View>

        <View style={styles.volumeRow}>
          <Ionicons color={COLORS.faint} name="volume-medium-outline" size={18} />
          <View style={styles.volumeTrack}>
            <View style={styles.volumeFill} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedSong, setSelectedSong] = useState(songs[0]);
  const authScreen = screen === "welcome" || screen === "login" || screen === "signup";

  function navigate(next: Screen, song?: Song) {
    if (song) setSelectedSong(song);
    setScreen(next);
  }

  return (
    <View style={styles.root}>
      <StatusBar style={authScreen ? "light" : "dark"} />
      {screen === "welcome" && <Welcome navigate={navigate} />}
      {screen === "login" && <AuthForm mode="login" navigate={navigate} />}
      {screen === "signup" && <AuthForm mode="signup" navigate={navigate} />}
      {screen === "home" && <Home navigate={navigate} />}
      {screen === "library" && <Library navigate={navigate} />}
      {screen === "player" && <Player initialSong={selectedSong} navigate={navigate} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.white },
  safeArea: { flex: 1 },
  authBackground: { flex: 1, backgroundColor: "#0a0a0a" },
  welcomeContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingBottom: 24,
    paddingTop: 42,
  },
  brand: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3.7,
    marginBottom: 22,
  },
  heroTitle: {
    color: COLORS.white,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
    fontSize: 40,
    fontWeight: "300",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  heroAccent: { color: "rgba(255,255,255,0.82)", fontStyle: "italic" },
  heroCopy: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 14,
    fontWeight: "300",
    lineHeight: 23,
    marginTop: 17,
    maxWidth: 270,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 16,
  },
  primaryButtonText: { color: COLORS.ink, fontSize: 13, fontWeight: "700" },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 50,
    paddingHorizontal: 16,
  },
  secondaryButtonText: { color: "rgba(255,255,255,0.82)", fontSize: 13, fontWeight: "600" },
  buttonPressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  photoCredit: {
    color: "rgba(255,255,255,0.32)",
    fontSize: 9,
    marginTop: 13,
    textAlign: "center",
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 24,
    paddingHorizontal: 28,
    paddingTop: 22,
  },
  authBack: {
    alignItems: "center",
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    marginBottom: 26,
    width: 36,
  },
  authTitle: {
    color: COLORS.white,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
    fontSize: 32,
    fontWeight: "300",
    letterSpacing: -0.8,
  },
  authSubtitle: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 14,
    fontWeight: "300",
    marginBottom: 24,
    marginTop: 8,
  },
  field: { marginBottom: 1 },
  fieldLabel: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  fieldInput: {
    borderBottomColor: "rgba(255,255,255,0.27)",
    borderBottomWidth: 1,
    color: COLORS.white,
    fontSize: 15,
    minHeight: 40,
    paddingBottom: 9,
    paddingHorizontal: 0,
    paddingTop: 4,
  },
  fieldInputError: { borderBottomColor: COLORS.error },
  fieldError: { color: COLORS.error, fontSize: 11, height: 23, paddingTop: 5 },
  authActions: { marginTop: 14 },
  authSwitchRow: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  authSwitchMuted: { color: "rgba(255,255,255,0.48)", fontSize: 12 },
  authSwitchLink: { color: COLORS.white, fontSize: 12, fontWeight: "600" },
  appScreen: { flex: 1, backgroundColor: COLORS.white },
  homeContent: { paddingBottom: 112 },
  homeHeader: { paddingHorizontal: 24, paddingTop: 20 },
  eyebrow: { color: COLORS.muted, fontSize: 10, letterSpacing: 1.7 },
  homeTitleRow: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  screenTitle: {
    color: COLORS.ink,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
    fontSize: 31,
    fontWeight: "300",
    letterSpacing: -1,
  },
  avatar: { borderRadius: 18, height: 34, marginBottom: 2, width: 34 },
  homeSection: { marginTop: 27 },
  horizontalSectionHeading: { paddingHorizontal: 24 },
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  sectionTitle: { color: COLORS.ink, fontSize: 13, fontWeight: "700" },
  sectionAction: { color: COLORS.muted, fontSize: 10 },
  featuredList: { gap: 13, paddingHorizontal: 24 },
  featuredCard: { width: 154 },
  featuredArt: {
    borderRadius: 18,
    height: 154,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.11,
    shadowRadius: 18,
    elevation: 4,
  },
  featuredTitle: { color: COLORS.ink, fontSize: 13, fontWeight: "700", marginTop: 11 },
  featuredArtist: { color: COLORS.muted, fontSize: 11, marginTop: 3 },
  cardPressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  contentSection: { marginTop: 30, paddingHorizontal: 24 },
  recentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  recentCard: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    flexDirection: "row",
    padding: 8,
    width: "48.5%",
  },
  recentArt: { borderRadius: 8, height: 42, width: 42 },
  recentText: { flex: 1, marginLeft: 9 },
  recentTitle: { color: COLORS.ink, fontSize: 11, fontWeight: "700" },
  recentArtist: { color: COLORS.muted, fontSize: 9, marginTop: 3 },
  albumArt: { overflow: "hidden", position: "relative" },
  albumRing: {
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    borderWidth: 1,
    height: "70%",
    position: "absolute",
    right: "-12%",
    top: "12%",
    width: "70%",
  },
  albumGlow: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 999,
    bottom: "-22%",
    height: "72%",
    left: "-16%",
    position: "absolute",
    width: "72%",
  },
  albumMark: {
    bottom: "11%",
    color: "rgba(255,255,255,0.76)",
    fontSize: 9,
    fontWeight: "600",
    left: "12%",
    letterSpacing: 2.2,
    position: "absolute",
  },
  songRow: {
    alignItems: "center",
    borderBottomColor: COLORS.surface,
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 67,
    paddingVertical: 11,
  },
  rowPressed: { backgroundColor: "#fafafa" },
  songRowArt: { borderRadius: 10, height: 45, width: 45 },
  songRowText: { flex: 1, marginLeft: 12, minWidth: 0 },
  songRowTitle: { color: "#262626", fontSize: 13, fontWeight: "600" },
  songRowArtist: { color: COLORS.muted, fontSize: 11, marginTop: 4 },
  songDuration: { color: COLORS.faint, fontSize: 10, marginLeft: 12 },
  navSafeArea: {
    backgroundColor: "rgba(255,255,255,0.98)",
    borderTopColor: COLORS.line,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bottomNav: { flexDirection: "row", minHeight: 62, paddingTop: 9 },
  navItem: { alignItems: "center", flex: 1, gap: 4 },
  navLabel: { color: COLORS.faint, fontSize: 10, fontWeight: "600" },
  navLabelActive: { color: COLORS.ink },
  libraryContent: { flexGrow: 1, paddingBottom: 112, paddingHorizontal: 24, paddingTop: 20 },
  searchBox: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 13,
    flexDirection: "row",
    gap: 9,
    marginTop: 22,
    minHeight: 47,
    paddingHorizontal: 14,
  },
  searchInput: { color: COLORS.ink, flex: 1, fontSize: 13, paddingVertical: 0 },
  resultCount: {
    color: COLORS.faint,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.4,
    marginBottom: 5,
    marginTop: 21,
  },
  emptyState: { alignItems: "center", paddingHorizontal: 28, paddingTop: 70 },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    marginBottom: 16,
    width: 56,
  },
  emptyTitle: { color: "#404040", fontSize: 14, fontWeight: "600" },
  emptyCopy: { color: COLORS.muted, fontSize: 12, lineHeight: 19, marginTop: 5, textAlign: "center" },
  player: { flex: 1, paddingBottom: 25, paddingHorizontal: 28, paddingTop: 16 },
  playerHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  roundButton: {
    alignItems: "center",
    borderColor: COLORS.line,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  roundButtonSpacer: { height: 36, width: 36 },
  playerHeading: { alignItems: "center" },
  playerEyebrow: { color: COLORS.muted, fontSize: 9, fontWeight: "600", letterSpacing: 1.8 },
  playerAlbum: { color: "#525252", fontSize: 11, marginTop: 4 },
  playerArt: {
    aspectRatio: 1,
    borderRadius: 28,
    marginTop: 30,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 12,
    width: "100%",
  },
  playerMeta: { alignItems: "center", flexDirection: "row", gap: 16, marginTop: 27 },
  playerMetaText: { flex: 1, minWidth: 0 },
  playerTitle: { color: COLORS.ink, fontSize: 21, fontWeight: "700", letterSpacing: -0.4 },
  playerArtist: { color: COLORS.muted, fontSize: 14, marginTop: 5 },
  progressSection: { marginTop: 22 },
  slider: { height: 26, marginHorizontal: -7 },
  timeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: -2 },
  timeText: { color: COLORS.muted, fontSize: 10 },
  playerControls: {
    alignItems: "center",
    flexDirection: "row",
    gap: 38,
    justifyContent: "center",
    marginTop: 14,
  },
  playButton: {
    alignItems: "center",
    backgroundColor: COLORS.ink,
    borderRadius: 34,
    height: 66,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 7,
    width: 66,
  },
  playButtonPressed: { transform: [{ scale: 0.94 }] },
  playIcon: { marginLeft: 3 },
  volumeRow: { alignItems: "center", flexDirection: "row", gap: 11, marginTop: "auto" },
  volumeTrack: {
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    flex: 1,
    height: 4,
    overflow: "hidden",
  },
  volumeFill: { backgroundColor: COLORS.faint, borderRadius: 3, height: 4, width: "67%" },
});

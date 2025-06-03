import { SQLiteDatabase } from "expo-sqlite";
import { Movement } from "./interfaceMovement";
import type { LinkProps } from "expo-router";
import { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

export interface ErrorScreenProps {
  error: string;
}

export type TimelineProps = {
  movements: Movement[]
}

export interface EditDeleteButtonsProps{
  typeObject:string;
  deleteFunction: (db: SQLiteDatabase, id: number) => Promise<void> | void;
  id:number;
  editActive?:boolean
}

export interface PreviewIdeaProps{
  typeContent:string;
  data:string;
  id:number;
  source:string;
  id_process?:number;
  id_scene?:number;
}

export interface AddIdealButtonModalProps{
  source:string,
  id_process:number | undefined;
  id_scene:number | undefined;
}

export interface AudioPickerRecorderProps {
  onAudioSelected: (uri: string) => void;
}

export interface AudioPlayerProps {
  audioUri: string | null;
}

export interface CustomModalProps {
  visible:boolean;
  onClose:() => void;
  options:CustomModalOption[]
}

export interface CustomModalOption {
  label: string;
  onPress?: () => void;
  icon: string;
  href?: LinkProps["href"];
}

export interface FormButtonsProps {
  handleSave: () => void;
  textButton?: string;
}

export interface GalleryPickerProps{
  image: string | null;
  setImage: (value: string) => void;
  setBase64Image: (value: string) => void;
  allowVideos?: boolean;
  isObject?: boolean;
}

export interface GradientTextProps {
  text: string
  fontSize?: number
}

export interface PreviewMoveProps{
  name: string;
  level: string;
  id: number;
}

export interface PreviewObjectProps{
  img: string;
  id: number;
}

export interface PreviewPersonProps{
  name:string;
  img: string | null;
  id: number;
  source: string;
  id_process:number | null;
}

export interface SelectableProps {
  onPress: (event: GestureResponderEvent) => void;
  isSelected: boolean;
}

export interface SelectIdeasProps extends SelectableProps {
  typeContent: string;
  data: string;
}

export interface SelectMoveProps extends SelectableProps {
  name: string;
  level: string;
}

export interface SelectPersonProps extends SelectableProps {
  name: string;
  img: string | null;
}

export interface SelectCreativeProcessProps extends SelectableProps{
  name:string;
  image:string | undefined;
}

export interface SelectSceneProps extends SelectableProps {
  name: string;
}

export interface TimePickerProps {
  time: { minutes: number; seconds: number }
  setTime: (time: { minutes: number; seconds: number }) => void
  label?: string
}

export interface TimelineEvent {
  title: string
  start: number
  end: number
  color: string
  id: number
  id_scene: number
  column?: number
  maxColumns?: number
}
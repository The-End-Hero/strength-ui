import React from "react";
import {
  FiVolume2,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiChevronUp,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiUploadCloud,
  FiCalendar,
  FiHardDrive,
  FiUser
} from "react-icons/fi";

import { IoMdCloseCircle } from "react-icons/io";

import CbIcon from "./checkbox/CheckBoxIcon";
import MCLIcon from "./MCLoadingIcon/mcloadingicon";
import MCSIcon from "./search/search";
import MCWarning from "./warning/warning";
import WIcon from "./wireicon/wireicon";


export const InfoIcon = props => <FiVolume2 {...props} />;
export const LoadingIcon = props => <FiLoader {...props} />;
export const SuccessIcon = props => <FiCheckCircle {...props} />;
export const ErrorIcon = props => <FiXCircle {...props} />;
export const CloseIcon = props => <FiX {...props} />;
export const UpIcon = props => <FiChevronUp {...props} />;
export const DownIcon = props => <FiChevronDown {...props} />;
export const ArrowRightIcon = props => <FiChevronRight {...props} />;
export const ArrowLeftIcon = props => <FiChevronLeft {...props} />;
export const FileUploadIcon = props => <FiUploadCloud {...props} />;
export const CalendarIcon = props => <FiCalendar {...props} />;
export const CloseCircleIcon = props => <IoMdCloseCircle {...props} />;
export const EmptyIcon = props => <FiHardDrive {...props} />;
export const UserIcon = props => <FiUser {...props} />;

// checkbox icon
export const CheckBoxIcon = props => <CbIcon {...props}/>;
// mc loading cur:button
export const MCLoadingIcon = props => <MCLIcon {...props}/>;


export const SearchIcon = props => <MCSIcon {...props}/>;

export const WarningIcon = props => <MCWarning {...props}/>;


// 点线面 线框风格 icon
export const WireIcon = props => <WIcon {...props}/>;

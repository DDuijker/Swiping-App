// Interface for a member in the group
export interface Member {
  id: string;
  username: string;
  avatar: string;
}

// Interface for the group details
export interface GroupDetails {
  groupName: string;
  description: string;
  image: string | null;
  selectedMembers: Member[];
}

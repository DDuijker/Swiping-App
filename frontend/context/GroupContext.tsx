import React, { createContext, useState, useContext, ReactNode } from "react";
import { Member, GroupDetails } from "../interfaces/groupTypes";
// Default context value, this will be overwritten in the provider
const GroupContext = createContext<{
  group: GroupDetails;
  updateGroupDetails: (details: Partial<GroupDetails>) => void;
  addMember: (member: Member) => void;
  removeMember: (memberId: string) => void;
}>({
  group: {
    groupName: "",
    description: "",
    image: null,
    selectedMembers: [],
  },
  updateGroupDetails: () => {},
  addMember: () => {},
  removeMember: () => {},
});

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [group, setGroup] = useState<GroupDetails>({
    groupName: "",
    description: "",
    image: null,
    selectedMembers: [],
  });

  // Function to update group details
  const updateGroupDetails = (details: Partial<GroupDetails>) => {
    setGroup((prevGroup) => ({
      ...prevGroup,
      ...details,
    }));
  };

  // Function to add a member
  const addMember = (member: Member) => {
    setGroup((prevGroup) => ({
      ...prevGroup,
      selectedMembers: [...prevGroup.selectedMembers, member],
    }));
  };

  // Function to remove a member
  const removeMember = (memberId: string) => {
    setGroup((prevGroup) => ({
      ...prevGroup,
      selectedMembers: prevGroup.selectedMembers.filter(
        (member) => member.id !== memberId
      ),
    }));
  };

  return (
    <GroupContext.Provider
      value={{
        group,
        updateGroupDetails,
        addMember,
        removeMember,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

// Hook for using the GroupContext in components
export const useGroup = () => useContext(GroupContext);

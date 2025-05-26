#!/bin/bash

# clear-memory.sh
# Script to clear memory caches on macOS

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=======================================${NC}"
echo -e "${YELLOW}   macOS Memory Cleanup Utility        ${NC}"
echo -e "${YELLOW}=======================================${NC}"

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   echo -e "${RED}This script must be run as root or with sudo${NC}"
   echo -e "Please run: ${YELLOW}sudo $0${NC}"
   exit 1
fi

# Print current memory usage
echo -e "\n${YELLOW}Current memory usage:${NC}"
vm_stat | grep "Pages free" | awk '{print $1 " " $2 " " $3 " " $4}'
vm_stat | grep "Pages active" | awk '{print $1 " " $2 " " $3}'
vm_stat | grep "Pages inactive" | awk '{print $1 " " $2 " " $3}'
vm_stat | grep "Pages speculative" | awk '{print $1 " " $2 " " $3}'
vm_stat | grep "Pages wired down" | awk '{print $1 " " $2 " " $3 " " $4}'

# Clear disk cache
echo -e "\n${YELLOW}Clearing disk cache...${NC}"
sync
sudo purge
echo -e "${GREEN}Disk cache cleared${NC}"

# Clear application memory
echo -e "\n${YELLOW}Clearing application memory...${NC}"

# Find processes using the most memory
echo -e "\n${YELLOW}Top memory-consuming processes:${NC}"
ps -axm -o pid,%mem,command | sort -nr -k 2 | head -10

# Ask user if they want to kill any specific processes
echo -e "\n${YELLOW}Do you want to kill any specific high-memory processes? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${YELLOW}Enter PID to kill (or 'q' to quit):${NC}"
    while read -r pid; do
        if [[ "$pid" == "q" ]]; then
            break
        fi
        
        if [[ "$pid" =~ ^[0-9]+$ ]]; then
            process_name=$(ps -p "$pid" -o command= 2>/dev/null)
            if [ -n "$process_name" ]; then
                echo -e "${YELLOW}Killing process $pid: $process_name${NC}"
                kill -9 "$pid"
                echo -e "${GREEN}Process killed${NC}"
            else
                echo -e "${RED}Process with PID $pid not found${NC}"
            fi
        else
            echo -e "${RED}Invalid PID. Please enter a number or 'q' to quit${NC}"
        fi
        
        echo -e "${YELLOW}Enter another PID to kill (or 'q' to quit):${NC}"
    done
fi

# Clear DNS cache
echo -e "\n${YELLOW}Clearing DNS cache...${NC}"
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
echo -e "${GREEN}DNS cache cleared${NC}"

# Print new memory usage
echo -e "\n${YELLOW}New memory usage:${NC}"
vm_stat | grep "Pages free" | awk '{print $1 " " $2 " " $3 " " $4}'
vm_stat | grep "Pages active" | awk '{print $1 " " $2 " " $3}'
vm_stat | grep "Pages inactive" | awk '{print $1 " " $2 " " $3}'
vm_stat | grep "Pages speculative" | awk '{print $1 " " $2 " " $3}'
vm_stat | grep "Pages wired down" | awk '{print $1 " " $2 " " $3 " " $4}'

echo -e "\n${GREEN}Memory cleanup completed!${NC}"
echo -e "${YELLOW}Note: You may need to restart some applications for best results.${NC}"

exit 0 
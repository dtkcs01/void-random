class Solution(object):
    """
        nums1 and nums2 are both sorted.
        nums1 => List[int](shape = (n))
        nums2 => List[int](shape = (m))
        out => int

        approach1: {
            Time Complexity: O((m + n)log(m + n)),
            Space Complexity: O(n + m)
        }

        approach2: {
            Time Complexity: O(m + n)
            Space Complexity: O(m + n)
        }

        approach3: {
            Time Complexity: O(log(min(m, n)))
            Space Complexity: O(1)
        }
    """

    def __init__(self, nums1, nums2):
        super(Solution, self).__init__()
        self.arg = arg

    def approach1(self, nums1, nums2):
        '''
            Time Complexity: O((m + n)log(m + n))
            Space Complexity: O(n + m)
        '''
        nums = [ *nums1, *nums2 ]
        nums.sort()
        l = len(nums)
        if(l%2 == 0):
            return (nums[l//2] + nums[l//2 - 1])/2
        else:
            return nums[l//2]

    def approach2(self, nums1, nums2):
        '''
            Time Complexity: O(m + n)
            Space Complexity: O(m + n)
        '''
        i = j = 0
        n, m = len(nums1), len(nums2)
        if(n > m):
            nums1, n, nums2, m = nums2, m, nums1, n
        nums = []
        while(i < n and j < m):
            if(nums1[i] > nums2[j]):
                nums.append(nums2[j])
                j += 1
            else:
                nums.append(nums1[i])
                i += 1
        while(j < m):
            nums.append(nums2[j])
            j += 1
        l = len(nums)
        if(l%2 == 0):
            return (nums[l//2] + nums[l//2 - 1])/2
        else:
            return nums[l//2]

    def approach3(self, nums1, nums2):
        '''
            Time Complexity: O(log(min(m, n)))
            Space Complexity: O(1)
        '''
        n, m = len(nums1), len(nums2)
        if(n > m):
            nums1, n, nums2, m = nums2, m, nums1, n
        l, mid, r = 0, (n + m + 1)//2, n
        while(r >= l):
            i = l + (r-l)//2
            j = mid - i
            if(i < n and nums2[j - 1] > nums1[i]):
                l = i + 1
            elif(i > 0 and nums1[i - 1] > nums2[j]):
                r = i - 1
            else:
                if(i == 0): ml = nums2[j-1]
                elif(j == 0): ml = nums1[i-1]
                else: ml = max(nums1[i-1], nums2[j-1])

                if((m+n)%2 == 1):
                    return ml

                if(i == n): mr = nums2[j]
                elif(j == m): mr = nums1[i]
                else: mr = min(nums1[i], nums2[j])

                return (ml+mr)/2

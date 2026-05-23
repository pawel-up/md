<template>
  <div>
    <section class="demo-section">
      <h2 class="title-large">Basic Menu</h2>
      <p>Click the button below to open a basic menu:</p>
      <ui-button id="basic-menu-trigger" color="filled" popovertarget="basic-menu">Open Basic Menu</ui-button>
      <ui-menu id="basic-menu" popover="auto" @select="handleBasicMenuSelect">
        <ui-menu-item>
          <span slot="start"><ui-icon>add</ui-icon></span>
          <span>New</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>folder</ui-icon></span>
          <span>Open</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>save</ui-icon></span>
          <span>Save</span>
        </ui-menu-item>
        <div class="menu-divider" role="separator"></div>
        <ui-menu-item>
          <span slot="start"><ui-icon>print</ui-icon></span>
          <span>Print</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>file_export</ui-icon></span>
          <span>Export</span>
        </ui-menu-item>
      </ui-menu>
      <template v-if="basicMenuOutput">
        <p>{{ basicMenuOutput }}</p>
        <p>Count: {{ basicCount }}</p>
      </template>
    </section>

    <section class="demo-section">
      <h2 class="title-large">Overflow Menu</h2>
      <p>A menu with many items that will overflow and require scrolling:</p>
      <ui-button id="overflow-menu-trigger" color="filled" popovertarget="overflow-menu">Open Overflow Menu</ui-button>
      <ui-menu id="overflow-menu" popover="auto" @select="handleOverflowMenuSelect">
        <ui-menu-item>
          <span slot="start"><ui-icon>home</ui-icon></span>
          <span>Home</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>account_circle</ui-icon></span>
          <span>Profile</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>settings</ui-icon></span>
          <span>Settings</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>notifications</ui-icon></span>
          <span>Notifications</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>mail</ui-icon></span>
          <span>Messages</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>favorite</ui-icon></span>
          <span>Favorites</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>bookmark</ui-icon></span>
          <span>Bookmarks</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>history</ui-icon></span>
          <span>History</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>download</ui-icon></span>
          <span>Downloads</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>cloud</ui-icon></span>
          <span>Cloud Storage</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>share</ui-icon></span>
          <span>Share</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>security</ui-icon></span>
          <span>Security</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>backup</ui-icon></span>
          <span>Backup</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>sync</ui-icon></span>
          <span>Sync</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>account_box</ui-icon></span>
          <span>Account Management</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>payment</ui-icon></span>
          <span>Payment Methods</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>credit_card</ui-icon></span>
          <span>Billing</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>receipt</ui-icon></span>
          <span>Receipts</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>analytics</ui-icon></span>
          <span>Analytics</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>insights</ui-icon></span>
          <span>Insights</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>trending_up</ui-icon></span>
          <span>Trends</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>dashboard</ui-icon></span>
          <span>Dashboard</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>widgets</ui-icon></span>
          <span>Widgets</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>extension</ui-icon></span>
          <span>Extensions</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>apps</ui-icon></span>
          <span>Applications</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>devices</ui-icon></span>
          <span>Devices</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>network_check</ui-icon></span>
          <span>Network Status</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>wifi</ui-icon></span>
          <span>Wi-Fi Settings</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>bluetooth</ui-icon></span>
          <span>Bluetooth</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>location_on</ui-icon></span>
          <span>Location Services</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>language</ui-icon></span>
          <span>Language</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>accessibility</ui-icon></span>
          <span>Accessibility</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>brightness_6</ui-icon></span>
          <span>Display</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>volume_up</ui-icon></span>
          <span>Sound</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>battery_std</ui-icon></span>
          <span>Battery</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>storage</ui-icon></span>
          <span>Storage</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>memory</ui-icon></span>
          <span>Memory</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>update</ui-icon></span>
          <span>Software Update</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>info</ui-icon></span>
          <span>About</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>help</ui-icon></span>
          <span>Help & Support</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>feedback</ui-icon></span>
          <span>Send Feedback</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>bug_report</ui-icon></span>
          <span>Report Bug</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>contact_support</ui-icon></span>
          <span>Contact Support</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>forum</ui-icon></span>
          <span>Community Forum</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>school</ui-icon></span>
          <span>Learning Center</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>library_books</ui-icon></span>
          <span>Documentation</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>video_library</ui-icon></span>
          <span>Video Tutorials</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>logout</ui-icon></span>
          <span>Sign Out</span>
        </ui-menu-item>
      </ui-menu>
      <template v-if="overflowMenuOutput">
        <p>{{ overflowMenuOutput }}</p>
        <p>Count: {{ overflowCount }}</p>
      </template>
    </section>

    <section class="demo-section">
      <h2 class="title-large">Submenus</h2>
      <p>A menu with submenus:</p>
      <ui-button id="submenu-trigger" color="filled" popovertarget="submenu-demo">Open Attribute-based Menu</ui-button>

      <!-- Main Menu -->
      <ui-menu id="submenu-demo" popover="auto" @select="handleNestedMenuSelect">
        <ui-menu-item id="file-item" submenu="file-submenu">
          <span slot="start"><ui-icon>docs</ui-icon></span>
          <span>File</span>
        </ui-menu-item>
        <ui-menu-item id="edit-item" submenu="edit-submenu">
          <span slot="start"><ui-icon>edit</ui-icon></span>
          <span>Edit</span>
        </ui-menu-item>
        <ui-menu-item id="view-item">
          <span slot="start"><ui-icon>visibility</ui-icon></span>
          <span>View</span>
        </ui-menu-item>
        <!-- File Submenu (separate from main menu) -->
        <ui-sub-menu id="file-submenu" anchor="file-item" popover="auto">
          <ui-menu-item>
            <span slot="start"><ui-icon>add</ui-icon></span>
            <span>New File</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>folder</ui-icon></span>
            <span>Open File</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>save</ui-icon></span>
            <span>Save File</span>
          </ui-menu-item>
          <ui-menu-item id="export-item" submenu="export-submenu">
            <span slot="start"><ui-icon>file_export</ui-icon></span>
            <span>Export</span>
          </ui-menu-item>

          <!-- Nested Export Submenu -->
          <ui-sub-menu id="export-submenu" anchor="export-item" popover="auto">
            <ui-menu-item>
              <span>Export as PDF</span>
            </ui-menu-item>
            <ui-menu-item>
              <span>Export as PNG</span>
            </ui-menu-item>
            <ui-menu-item>
              <span>Export as SVG</span>
            </ui-menu-item>
          </ui-sub-menu>
        </ui-sub-menu>
        <!-- Edit Submenu -->
        <ui-sub-menu id="edit-submenu" anchor="edit-item" popover="auto">
          <ui-menu-item>
            <span slot="start"><ui-icon>undo</ui-icon></span>
            <span>Undo</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>redo</ui-icon></span>
            <span>Redo</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>cut</ui-icon></span>
            <span>Cut</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>content_copy</ui-icon></span>
            <span>Copy</span>
          </ui-menu-item>
        </ui-sub-menu>
      </ui-menu>
      <template v-if="nestedMenuOutput">
        <p>{{ nestedMenuOutput }}</p>
        <p>Count: {{ nestedCount }}</p>
      </template>
    </section>

    <section class="demo-section">
      <h2 class="title-large">Selection Menu</h2>
      <p>A menu that allows selection of options:</p>
      <ui-button id="selection-menu-trigger" color="filled" popovertarget="selection-menu">Open Selection Menu</ui-button>
      <ui-menu id="selection-menu" popover="auto" @select="handleSelectionMenuSelect">
        <ui-menu-item data-value="option1" :selected="selectedOption === 'Option 1'">
          <span v-if="selectedOption === 'Option 1'" slot="start"><ui-icon>check</ui-icon></span>
          <span>Option 1</span>
        </ui-menu-item>
        <ui-menu-item data-value="option2" :selected="selectedOption === 'Option 2'">
          <span v-if="selectedOption === 'Option 2'" slot="start"><ui-icon>check</ui-icon></span>
          <span>Option 2</span>
        </ui-menu-item>
        <ui-menu-item data-value="option3" :selected="selectedOption === 'Option 3'">
          <span v-if="selectedOption === 'Option 3'" slot="start"><ui-icon>check</ui-icon></span>
          <span>Option 3</span>
        </ui-menu-item>
      </ui-menu>
      <p v-if="selectedOption">Selected: {{ selectedOption }}</p>
    </section>

    <section class="demo-section">
      <h2 class="title-large">Menu with Selection and icons</h2>
      <p>
        A menu that maintains selection state. Select an option and reopen the menu to see the selection preserved:
      </p>
      <ui-button id="single-select-menu-trigger" color="filled" popovertarget="single-select-menu">
        Select Option: {{ iconMenuSelectedOption || 'None' }}
      </ui-button>
      <ui-menu id="single-select-menu" popover="auto" selectOnActivate @select="handleIconSelectMenuSelect">
        <ui-menu-item value="premium" showSelectionIcon>
          <span slot="start"><ui-icon>star</ui-icon></span>
          <span>Premium</span>
        </ui-menu-item>
        <ui-menu-item value="standard" showSelectionIcon>
          <span slot="start"><ui-icon>account_circle</ui-icon></span>
          <span>Standard</span>
        </ui-menu-item>
        <ui-menu-item value="basic" showSelectionIcon>
          <span slot="start"><ui-icon>public</ui-icon></span>
          <span>Basic</span>
        </ui-menu-item>
      </ui-menu>
      <p v-if="iconMenuSelectOutput">{{ iconMenuSelectOutput }}</p>
    </section>

    <section class="demo-section">
      <h2 class="title-large">Menu with Auto-Check Icons</h2>
      <p>
        A menu that automatically shows check icons for selected items when the
        <code>show-selection-icon</code> attribute is used:
      </p>
      <ui-button id="auto-check-menu-trigger" color="filled" popovertarget="auto-check-menu">
        Priority: {{ autoCheckSelectedOption || 'None' }}
      </ui-button>
      <ui-menu id="auto-check-menu" selectOnActivate popover="auto" @select="handleAutoCheckMenuSelect">
        <ui-menu-item showSelectionIcon>
          <span>Low</span>
        </ui-menu-item>
        <ui-menu-item showSelectionIcon selected>
          <span>High</span>
        </ui-menu-item>
        <ui-menu-item showSelectionIcon>
          <span>Critical</span>
        </ui-menu-item>
      </ui-menu>
      <p v-if="autoCheckMenuOutput">{{ autoCheckMenuOutput }}</p>
    </section>

    <section class="demo-section">
      <h2 class="title-large">Edge Positioning Test with Complex Submenus</h2>
      <p>Test menu positioning and submenu behavior at screen edges with multiple nesting levels:</p>
      <div style="display: flex; justify-content: space-between; margin: 20px 0;">
        <ui-button id="left-edge-menu-trigger" color="filled" popovertarget="left-edge-menu">Left Edge Complex</ui-button>
        <ui-button id="right-edge-menu-trigger" color="filled" popovertarget="right-edge-menu">Right Edge Complex</ui-button>
      </div>

      <ui-menu id="left-edge-menu" popover="auto" @select="handleBasicMenuSelect">
        <ui-menu-item>
          <span slot="start"><ui-icon>home</ui-icon></span>
          <span>Left Edge Item 1</span>
        </ui-menu-item>
        <ui-menu-item id="left-edge-submenu-item" submenu="left-edge-submenu">
          <span slot="start"><ui-icon>folder</ui-icon></span>
          <span>Submenu with Options</span>
        </ui-menu-item>
        <ui-menu-item id="left-edge-nested-item" submenu="left-edge-nested">
          <span slot="start"><ui-icon>settings</ui-icon></span>
          <span>Deeply Nested Menu</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>info</ui-icon></span>
          <span>Left Edge Item 4</span>
        </ui-menu-item>

        <!-- Left Edge Submenu -->
        <ui-sub-menu id="left-edge-submenu" anchor="left-edge-submenu-item" popover="auto">
          <ui-menu-item>
            <span slot="start"><ui-icon>add</ui-icon></span>
            <span>Create New</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>edit</ui-icon></span>
            <span>Edit Existing</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>delete</ui-icon></span>
            <span>Delete Item</span>
          </ui-menu-item>
          <ui-menu-item id="left-edge-actions-item" submenu="left-edge-actions">
            <span slot="start"><ui-icon>more_horiz</ui-icon></span>
            <span>More Actions</span>
          </ui-menu-item>

          <!-- Nested Actions Submenu -->
          <ui-sub-menu id="left-edge-actions" anchor="left-edge-actions-item" popover="auto">
            <ui-menu-item>
              <span slot="start"><ui-icon>share</ui-icon></span>
              <span>Share</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>download</ui-icon></span>
              <span>Download</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>copy</ui-icon></span>
              <span>Duplicate</span>
            </ui-menu-item>
          </ui-sub-menu>
        </ui-sub-menu>

        <!-- Left Edge Deeply Nested Menu -->
        <ui-sub-menu id="left-edge-nested" anchor="left-edge-nested-item" popover="auto">
          <ui-menu-item id="left-edge-preferences-item" submenu="left-edge-preferences">
            <span slot="start"><ui-icon>tune</ui-icon></span>
            <span>Preferences</span>
          </ui-menu-item>
          <ui-menu-item id="left-edge-advanced-item" submenu="left-edge-advanced">
            <span slot="start"><ui-icon>build</ui-icon></span>
            <span>Advanced Settings</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>help</ui-icon></span>
            <span>Help & Support</span>
          </ui-menu-item>

          <!-- Preferences Submenu -->
          <ui-sub-menu id="left-edge-preferences" anchor="left-edge-preferences-item" popover="auto">
            <ui-menu-item>
              <span slot="start"><ui-icon>palette</ui-icon></span>
              <span>Theme Settings</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>language</ui-icon></span>
              <span>Language</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>notifications</ui-icon></span>
              <span>Notifications</span>
            </ui-menu-item>
          </ui-sub-menu>

          <!-- Advanced Settings Submenu -->
          <ui-sub-menu id="left-edge-advanced" anchor="left-edge-advanced-item" popover="auto">
            <ui-menu-item>
              <span slot="start"><ui-icon>memory</ui-icon></span>
              <span>Memory Management</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>security</ui-icon></span>
              <span>Security Options</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>developer_mode</ui-icon></span>
              <span>Developer Tools</span>
            </ui-menu-item>
          </ui-sub-menu>
        </ui-sub-menu>
      </ui-menu>

      <ui-menu id="right-edge-menu" popover="auto" @select="handleBasicMenuSelect">
        <ui-menu-item>
          <span slot="start"><ui-icon>account_circle</ui-icon></span>
          <span>Right Edge Item 1</span>
        </ui-menu-item>
        <ui-menu-item id="right-edge-submenu-item" submenu="right-edge-submenu">
          <span slot="start"><ui-icon>work</ui-icon></span>
          <span>Workspace Options</span>
        </ui-menu-item>
        <ui-menu-item id="right-edge-tools-item" submenu="right-edge-tools">
          <span slot="start"><ui-icon>build_circle</ui-icon></span>
          <span>Tools & Utilities</span>
        </ui-menu-item>
        <ui-menu-item>
          <span slot="start"><ui-icon>logout</ui-icon></span>
          <span>Sign Out</span>
        </ui-menu-item>

        <!-- Right Edge Workspace Submenu -->
        <ui-sub-menu id="right-edge-submenu" anchor="right-edge-submenu-item" popover="auto">
          <ui-menu-item>
            <span slot="start"><ui-icon>create_new_folder</ui-icon></span>
            <span>New Workspace</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>folder_open</ui-icon></span>
            <span>Open Workspace</span>
          </ui-menu-item>
          <ui-menu-item id="right-edge-recent-item" submenu="right-edge-recent">
            <span slot="start"><ui-icon>history</ui-icon></span>
            <span>Recent Workspaces</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>bookmark</ui-icon></span>
            <span>Bookmark Current</span>
          </ui-menu-item>

          <!-- Recent Workspaces Submenu -->
          <ui-sub-menu id="right-edge-recent" anchor="right-edge-recent-item" popover="auto">
            <ui-menu-item>
              <span slot="start"><ui-icon>web</ui-icon></span>
              <span>API Project Alpha</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>mobile_friendly</ui-icon></span>
              <span>Mobile App Beta</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>desktop_mac</ui-icon></span>
              <span>Desktop Client</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>cloud</ui-icon></span>
              <span>Cloud Services</span>
            </ui-menu-item>
          </ui-sub-menu>
        </ui-sub-menu>

        <!-- Right Edge Tools Submenu -->
        <ui-sub-menu id="right-edge-tools" anchor="right-edge-tools-item" popover="auto">
          <ui-menu-item id="right-edge-dev-tools-item" submenu="right-edge-dev-tools">
            <span slot="start"><ui-icon>code</ui-icon></span>
            <span>Development Tools</span>
          </ui-menu-item>
          <ui-menu-item id="right-edge-analysis-item" submenu="right-edge-analysis">
            <span slot="start"><ui-icon>analytics</ui-icon></span>
            <span>Analysis Tools</span>
          </ui-menu-item>
          <ui-menu-item>
            <span slot="start"><ui-icon>extension</ui-icon></span>
            <span>Extensions</span>
          </ui-menu-item>

          <!-- Development Tools Submenu -->
          <ui-sub-menu id="right-edge-dev-tools" anchor="right-edge-dev-tools-item" popover="auto">
            <ui-menu-item>
              <span slot="start"><ui-icon>terminal</ui-icon></span>
              <span>Terminal</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>bug_report</ui-icon></span>
              <span>Debugger</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>speed</ui-icon></span>
              <span>Performance Monitor</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>visibility</ui-icon></span>
              <span>Inspector</span>
            </ui-menu-item>
          </ui-sub-menu>

          <!-- Analysis Tools Submenu -->
          <ui-sub-menu id="right-edge-analysis" anchor="right-edge-analysis-item" popover="auto">
            <ui-menu-item>
              <span slot="start"><ui-icon>assessment</ui-icon></span>
              <span>Reports</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>trending_up</ui-icon></span>
              <span>Metrics</span>
            </ui-menu-item>
            <ui-menu-item>
              <span slot="start"><ui-icon>pie_chart</ui-icon></span>
              <span>Usage Analytics</span>
            </ui-menu-item>
          </ui-sub-menu>
        </ui-sub-menu>
      </ui-menu>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import '../../src/components/menu/ui-menu.js'
import '../../src/components/menu/ui-sub-menu.js'
import '../../src/components/menu/ui-menu-item.js'
import '../../src/components/button/ui-button.js'
import '../../src/components/icons/ui-icon.js'

const basicMenuOutput = ref('')
const basicCount = ref(0)
const nestedMenuOutput = ref('')
const nestedCount = ref(0)
const overflowMenuOutput = ref('')
const overflowCount = ref(0)
const selectedOption = ref('')
const iconMenuSelectOutput = ref('')
const iconMenuSelectedOption = ref('Premium')
const autoCheckMenuOutput = ref('')
const autoCheckSelectedOption = ref('High')

const handleBasicMenuSelect = (e: CustomEvent) => {
  const item = e.detail.item as HTMLElement
  const index = e.detail.index
  basicMenuOutput.value = `Selected item: ${item.textContent}, Index: ${index}`
  basicCount.value++
}

const handleNestedMenuSelect = (e: CustomEvent) => {
  const item = e.detail.item as HTMLElement
  const index = e.detail.index
  nestedMenuOutput.value = `Selected item: ${item.textContent}, Index: ${index}`
  nestedCount.value++
}

const handleOverflowMenuSelect = (e: CustomEvent) => {
  const item = e.detail.item as HTMLElement
  const index = e.detail.index
  overflowMenuOutput.value = `Selected item: ${item.textContent}, Index: ${index}`
  overflowCount.value++
}

const handleSelectionMenuSelect = (e: CustomEvent) => {
  const item = e.detail.item as HTMLElement
  selectedOption.value = item.textContent?.trim() || ''
}

const handleIconSelectMenuSelect = (e: CustomEvent) => {
  const item = e.detail.item as any
  iconMenuSelectedOption.value = item.value || ''
  iconMenuSelectOutput.value = `Selected: ${iconMenuSelectedOption.value}`
}

const handleAutoCheckMenuSelect = (e: CustomEvent) => {
  const item = e.detail.item as HTMLElement
  autoCheckSelectedOption.value = item.textContent?.trim() || ''
  autoCheckMenuOutput.value = `Selected: ${autoCheckSelectedOption.value}`
}
</script>
